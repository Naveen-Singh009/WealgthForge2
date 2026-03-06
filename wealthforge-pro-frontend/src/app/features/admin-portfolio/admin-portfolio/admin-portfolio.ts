import { Component, OnInit, inject } from '@angular/core';
import { catchError, forkJoin, of } from 'rxjs';

import { LoadingService } from '../../../core/services/loading.service';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { ToastService } from '../../../core/services/toast.service';
import { AdminPortfolioSummary } from '../../../shared/models/portfolio.model';

@Component({
  selector: 'app-admin-portfolio',
  standalone: false,
  templateUrl: './admin-portfolio.html',
  styleUrl: './admin-portfolio.scss',
})
export class AdminPortfolioComponent implements OnInit {
  private readonly portfolioService = inject(PortfolioService);
  private readonly loadingService = inject(LoadingService);
  private readonly toastService = inject(ToastService);

  portfolios: AdminPortfolioSummary[] = [];

  ngOnInit(): void {
    this.loadPortfolios();
  }

  loadPortfolios(): void {
    this.loadingService.show();

    forkJoin({
      portfolios: this.portfolioService.getAdminPortfolios(),
      investors: this.portfolioService.getAdminInvestors().pipe(
        catchError(() => of({ success: false, message: 'Investors unavailable', data: [] }))
      ),
    }).subscribe({
      next: ({ portfolios, investors }) => {
        const investorNameById = new Map(
          (investors.data ?? [])
            .filter((investor) => investor?.investorId != null)
            .map((investor) => [investor.investorId, (investor.investorName ?? '').trim()])
        );

        this.portfolios = (portfolios.data ?? []).map((portfolio) => {
          const fallbackName =
            portfolio.investorId != null ? investorNameById.get(portfolio.investorId) : undefined;
          return {
            ...portfolio,
            investorName: portfolio.investorName || fallbackName || undefined,
          };
        });
      },
      error: () => {
        this.toastService.show('error', 'Portfolio Load Failed', 'Unable to load investor portfolios.');
      },
      complete: () => {
        this.loadingService.hide();
      },
    });
  }
}
