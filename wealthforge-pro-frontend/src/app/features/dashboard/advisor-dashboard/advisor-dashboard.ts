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
  selector: 'app-advisor-dashboard',
  standalone: false,
  templateUrl: './advisor-dashboard.html',
  styleUrl: './advisor-dashboard.scss',
})
export class AdvisorDashboardComponent implements OnInit {
  advisors: Advisor[] = [];
  allocatedInvestorIds: number[] = [];
  assignedInvestors: InvestorSummary[] = [];
  mappedAdvisor: Advisor | null = null;
  portfolioInsightRows: PortfolioInsightRow[] = [];
  trackedPortfolioCount = 0;
  trackedPortfolioBalance = 0;

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
        this.advisors = response.data ?? [];
        this.mappedAdvisor = this.resolveLoggedInAdvisor(this.authService.getCurrentUser());

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
        this.allocatedInvestorIds = investorIds;
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
        this.trackedPortfolioCount = this.portfolioInsightRows.filter((row) => row.portfolioId !== null).length;
        this.trackedPortfolioBalance = this.portfolioInsightRows
          .filter((row) => row.portfolioId !== null)
          .reduce((total, row) => total + row.balance, 0);
      },
      error: () => {
        this.toastService.show('error', 'Advisor Data Error', 'Unable to load portfolio insights.');
      },
      complete: () => {
        this.loadingService.hide();
      },
    });
  }

  get assignedInvestorCount(): string {
    return this.allocatedInvestorIds.length.toString();
  }

  get trackedPortfolioCountValue(): string {
    return this.trackedPortfolioCount.toString();
  }

  get trackedPortfolioBalanceValue(): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(this.trackedPortfolioBalance);
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

  private resolveLoggedInAdvisor(user: CurrentUser | null): Advisor | null {
    if (!user) {
      return null;
    }

    const normalizedEmail = user.email?.trim().toLowerCase() ?? '';
    const byEmail = this.advisors.find((advisor) => advisor.email?.trim().toLowerCase() === normalizedEmail) ?? null;
    if (byEmail) {
      return byEmail;
    }

    const userId = Number(user.id);
    return this.advisors.find((advisor) => Number(advisor.id) === userId) ?? null;
  }
}
