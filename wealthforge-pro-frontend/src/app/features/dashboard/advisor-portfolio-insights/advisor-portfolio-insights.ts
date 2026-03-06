import { Component, OnInit } from '@angular/core';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';

import { AdvisorService } from '../../../core/services/advisor.service';
import { AuthService } from '../../../core/services/auth.service';
import { LoadingService } from '../../../core/services/loading.service';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { ToastService } from '../../../core/services/toast.service';
import { Advisor } from '../../../shared/models/advisor.model';
import { InvestorSummary } from '../../../shared/models/investor.model';
import { Portfolio } from '../../../shared/models/portfolio.model';
import { CurrentUser } from '../../../shared/models/user.model';

interface PortfolioInsightRow {
  investorId: number;
  investorName: string;
  investorEmail: string;
  portfolioId: number | null;
  portfolioName: string;
  balance: number;
  createdAt: string | null;
}

@Component({
  selector: 'app-advisor-portfolio-insights',
  standalone: false,
  templateUrl: './advisor-portfolio-insights.html',
  styleUrl: './advisor-portfolio-insights.scss',
})
export class AdvisorPortfolioInsightsComponent implements OnInit {
  mappedAdvisor: Advisor | null = null;
  assignedInvestors: InvestorSummary[] = [];
  portfolioInsightRows: PortfolioInsightRow[] = [];
  selectedInvestorId = 0;

  constructor(
    private readonly advisorService: AdvisorService,
    private readonly authService: AuthService,
    private readonly portfolioService: PortfolioService,
    private readonly loadingService: LoadingService,
    private readonly toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadingService.show();

    this.advisorService.getAdvisors().pipe(
      switchMap((response) => {
        const advisors = response.data ?? [];
        this.mappedAdvisor = this.resolveLoggedInAdvisor(this.authService.getCurrentUser(), advisors);

        if (!this.mappedAdvisor) {
          return of({ investorIds: [] as number[], investors: [] as InvestorSummary[] });
        }

        return this.advisorService.getAllocatedInvestorIds(this.mappedAdvisor.id).pipe(
          switchMap((investorIds) =>
            this.advisorService.getInvestorsByIds(investorIds).pipe(
              map((investors) => ({
                investorIds: investorIds ?? [],
                investors: investors ?? [],
              }))
            )
          )
        );
      }),
      switchMap(({ investorIds, investors }) => {
        this.assignedInvestors = investors;

        if (investorIds.length === 0) {
          return of({ investorIds, portfoliosByInvestor: new Map<number, Portfolio[]>() });
        }

        const portfolioRequests = investorIds.map((investorId) =>
          this.portfolioService.getAdvisorInvestorPortfolios(investorId).pipe(
            map((response) => response.data ?? []),
            catchError(() => of([] as Portfolio[]))
          )
        );

        return forkJoin(portfolioRequests).pipe(
          map((portfolioLists) => {
            const portfoliosByInvestor = new Map<number, Portfolio[]>();
            investorIds.forEach((investorId, index) => {
              portfoliosByInvestor.set(investorId, portfolioLists[index] ?? []);
            });

            return { investorIds, portfoliosByInvestor };
          })
        );
      })
    ).subscribe({
      next: ({ investorIds, portfoliosByInvestor }) => {
        this.portfolioInsightRows = this.buildPortfolioInsightRows(investorIds, portfoliosByInvestor);

        if (this.selectedInvestorId > 0
          && !this.assignedInvestors.some((investor) => Number(investor.investorId) === this.selectedInvestorId)) {
          this.selectedInvestorId = 0;
        }
      },
      error: () => {
        this.toastService.show('error', 'Portfolio Insights Error', 'Unable to load investor portfolio insights.');
      },
      complete: () => {
        this.loadingService.hide();
      },
    });
  }

  get assignedInvestorCountValue(): string {
    return this.assignedInvestors.length.toString();
  }

  get trackedPortfolioCountValue(): string {
    return this.filteredPortfolioRows.filter((row) => row.portfolioId !== null).length.toString();
  }

  get trackedPortfolioBalanceValue(): string {
    const filteredPortfolioBalance = this.filteredPortfolioRows
      .filter((row) => row.portfolioId !== null)
      .reduce((total, row) => total + row.balance, 0);

    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(filteredPortfolioBalance);
  }

  get investorsWithoutPortfolioValue(): string {
    return this.filteredPortfolioRows.filter((row) => row.portfolioId === null).length.toString();
  }

  get selectedInvestor(): InvestorSummary | null {
    if (this.selectedInvestorId <= 0) {
      return null;
    }

    return this.assignedInvestors.find((investor) => Number(investor.investorId) === this.selectedInvestorId) ?? null;
  }

  get analysisScopeLabel(): string {
    const selectedInvestor = this.selectedInvestor;
    if (!selectedInvestor) {
      return 'all assigned investors';
    }

    return `${selectedInvestor.investorName} (${selectedInvestor.investorId})`;
  }

  get filteredPortfolioRows(): PortfolioInsightRow[] {
    if (this.selectedInvestorId <= 0) {
      return this.portfolioInsightRows;
    }

    return this.portfolioInsightRows.filter((row) => row.investorId === this.selectedInvestorId);
  }

  onInvestorFilterChange(rawValue: string): void {
    const selectedValue = Number(rawValue);
    this.selectedInvestorId = Number.isInteger(selectedValue) && selectedValue > 0 ? selectedValue : 0;
  }

  private buildPortfolioInsightRows(
    investorIds: number[],
    portfoliosByInvestor: Map<number, Portfolio[]>
  ): PortfolioInsightRow[] {
    const investorById = new Map<number, InvestorSummary>(
      this.assignedInvestors.map((investor) => [Number(investor.investorId), investor])
    );

    const rows: PortfolioInsightRow[] = [];

    for (const investorId of investorIds) {
      const investor = investorById.get(Number(investorId));
      const investorName = investor?.investorName ?? `Investor ${investorId}`;
      const investorEmail = investor?.email ?? '--';
      const portfolios = portfoliosByInvestor.get(investorId) ?? [];

      if (portfolios.length === 0) {
        rows.push({
          investorId,
          investorName,
          investorEmail,
          portfolioId: null,
          portfolioName: 'No Portfolio',
          balance: 0,
          createdAt: null,
        });
        continue;
      }

      for (const portfolio of portfolios) {
        rows.push({
          investorId,
          investorName,
          investorEmail,
          portfolioId: Number(portfolio.id),
          portfolioName: portfolio.name,
          balance: Number(portfolio.balance ?? 0),
          createdAt: portfolio.createdAt ?? null,
        });
      }
    }

    return rows;
  }

  private resolveLoggedInAdvisor(user: CurrentUser | null, advisors: Advisor[]): Advisor | null {
    if (!user) {
      return null;
    }

    const normalizedEmail = user.email?.trim().toLowerCase() ?? '';
    const byEmail = advisors.find((advisor) => advisor.email?.trim().toLowerCase() === normalizedEmail) ?? null;
    if (byEmail) {
      return byEmail;
    }

    return advisors.find((advisor) => Number(advisor.id) === Number(user.id)) ?? null;
  }
}
