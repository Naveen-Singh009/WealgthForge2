import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { LoadingService } from '../../../core/services/loading.service';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { ToastService } from '../../../core/services/toast.service';
import { DeletePortfolioSummary, Portfolio } from '../../../shared/models/portfolio.model';

type SortColumn = 'name' | 'balance' | 'createdAt';
type PaymentStatus = 'Pending' | 'Done';

interface PaymentHistoryEntry {
  id: string;
  portfolioId: number;
  portfolioName: string;
  amount: number;
  method: 'UPI' | 'NetBanking' | 'Card';
  status: PaymentStatus;
  paidAt: string;
}

@Component({
  selector: 'app-portfolio-list',
  standalone: false,
  templateUrl: './portfolio-list.html',
  styleUrl: './portfolio-list.scss',
})
export class PortfolioListComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly paymentHistoryStorageKey = 'wf_portfolio_payment_history';

  portfolios: Portfolio[] = [];
  selectedPortfolio: Portfolio | null = null;
  showEditModal = false;
  showPaymentHistoryModal = false;
  savingChanges = false;
  deletingPortfolio = false;
  paymentHistory: PaymentHistoryEntry[] = [];
  activePaymentPortfolioName = '';
  activePaymentAmount = 0;
  pendingPaymentId: string | null = null;

  page = 1;
  pageSize = 5;
  sortColumn: SortColumn = 'createdAt';
  sortDirection: 'asc' | 'desc' = 'desc';

  readonly editPortfolioForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
    additionalBalance: [0, [Validators.required, Validators.min(0)]],
  });

  constructor(
    private readonly authService: AuthService,
    private readonly portfolioService: PortfolioService,
    private readonly loadingService: LoadingService,
    private readonly toastService: ToastService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadPortfolios();
  }

  loadPortfolios(): void {
    if (!this.authService.getCurrentUserId()) {
      return;
    }

    this.loadingService.show();

    this.portfolioService.getInvestorPortfolios().subscribe({
      next: (response) => {
        this.portfolios = response.data ?? [];
      },
      error: () => {
        this.toastService.show('error', 'Portfolio Error', 'Unable to load portfolios.');
      },
      complete: () => {
        this.loadingService.hide();
      },
    });
  }

  sortBy(column: SortColumn): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }

  openEditModal(portfolio: Portfolio): void {
    this.selectedPortfolio = portfolio;
    this.editPortfolioForm.reset({
      name: portfolio.name ?? '',
      additionalBalance: 0,
    });
    this.showEditModal = true;
  }

  closeEditModal(): void {
    if (this.savingChanges || this.deletingPortfolio) {
      return;
    }

    this.resetEditState();
  }

  savePortfolioChanges(): void {
    if (!this.selectedPortfolio || this.savingChanges) {
      return;
    }

    if (this.editPortfolioForm.invalid) {
      this.editPortfolioForm.markAllAsTouched();
      return;
    }

    this.savingChanges = true;
    this.loadingService.show();

    const payload = this.editPortfolioForm.getRawValue();
    const addedBalance = Number(payload.additionalBalance ?? 0);

    this.portfolioService.updatePortfolio(this.selectedPortfolio.id, {
      name: payload.name.trim(),
      additionalBalance: payload.additionalBalance,
    }).subscribe({
      next: () => {
        if (addedBalance > 0) {
          this.openPaymentHistorySection(addedBalance, this.selectedPortfolio as Portfolio);
        } else {
          this.toastService.show('success', 'Portfolio Updated', 'Portfolio details were updated successfully.');
        }
        this.resetEditState();
      },
      error: (error) => {
        const message = error?.error?.message ?? error?.error ?? 'Unable to update portfolio.';
        this.toastService.show('error', 'Update Failed', String(message));
        this.loadingService.hide();
        this.savingChanges = false;
      },
      complete: () => {
        this.loadingService.hide();
        this.savingChanges = false;
        this.loadPortfolios();
      },
    });
  }

  deleteSelectedPortfolio(): void {
    if (!this.selectedPortfolio || this.deletingPortfolio) {
      return;
    }

    this.deletingPortfolio = true;
    this.loadingService.show();

    this.portfolioService.deletePortfolio(this.selectedPortfolio.id).subscribe({
      next: (response) => {
        const summary = response.data as DeletePortfolioSummary | null;
        const amount = summary?.transferredAmount ?? this.selectedPortfolio?.balance ?? 0;
        const portfolioName = summary?.portfolioName ?? this.selectedPortfolio?.name ?? '';

        this.toastService.show('success', 'Portfolio Deleted', 'Money transferred to your bank account successfully.');
        this.resetEditState();

        this.router.navigate(['/investor/portfolio/deleted'], {
          queryParams: {
            amount,
            name: portfolioName,
          },
        });
      },
      error: (error) => {
        const message = error?.error?.message ?? error?.error ?? 'Unable to delete portfolio.';
        this.toastService.show('error', 'Delete Failed', String(message));
        this.loadingService.hide();
        this.deletingPortfolio = false;
      },
      complete: () => {
        this.loadingService.hide();
        this.deletingPortfolio = false;
        this.loadPortfolios();
      },
    });
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page += 1;
    }
  }

  previousPage(): void {
    if (this.page > 1) {
      this.page -= 1;
    }
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.sortedPortfolios.length / this.pageSize));
  }

  get pagedPortfolios(): Portfolio[] {
    const startIndex = (this.page - 1) * this.pageSize;
    return this.sortedPortfolios.slice(startIndex, startIndex + this.pageSize);
  }

  private get sortedPortfolios(): Portfolio[] {
    const copy = [...this.portfolios];

    copy.sort((a, b) => {
      const direction = this.sortDirection === 'asc' ? 1 : -1;

      if (this.sortColumn === 'balance') {
        return ((a.balance ?? 0) - (b.balance ?? 0)) * direction;
      }

      if (this.sortColumn === 'createdAt') {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return (timeA - timeB) * direction;
      }

      return (a.name ?? '').localeCompare(b.name ?? '') * direction;
    });

    return copy;
  }

  private resetEditState(): void {
    this.showEditModal = false;
    this.selectedPortfolio = null;
    this.editPortfolioForm.reset({
      name: '',
      additionalBalance: 0,
    });
  }

  closePaymentHistoryModal(): void {
    this.showPaymentHistoryModal = false;
    this.pendingPaymentId = null;
    this.activePaymentAmount = 0;
    this.activePaymentPortfolioName = '';
    this.paymentHistory = [];
  }

  confirmPaymentDone(): void {
    if (!this.pendingPaymentId) {
      this.closePaymentHistoryModal();
      return;
    }

    const history = this.readPaymentHistory().map((entry) => {
      if (entry.id !== this.pendingPaymentId) {
        return entry;
      }

      return {
        ...entry,
        status: 'Done' as const,
      };
    });

    this.persistPaymentHistory(history);

    this.paymentHistory = this.paymentHistory.map((entry) => (
      entry.id === this.pendingPaymentId ? { ...entry, status: 'Done' } : entry
    ));

    this.toastService.show('success', 'Payment Done', 'Payment is done.');
    this.closePaymentHistoryModal();
  }

  private openPaymentHistorySection(amount: number, portfolio: Portfolio): void {
    const history = this.readPaymentHistory();
    const pendingPaymentEntry: PaymentHistoryEntry = {
      id: `${portfolio.id}-${Date.now()}`,
      portfolioId: portfolio.id,
      portfolioName: portfolio.name,
      amount,
      method: 'NetBanking',
      status: 'Pending',
      paidAt: new Date().toISOString(),
    };

    const updatedHistory = [pendingPaymentEntry, ...history];
    this.persistPaymentHistory(updatedHistory);

    this.pendingPaymentId = pendingPaymentEntry.id;
    this.activePaymentAmount = amount;
    this.activePaymentPortfolioName = portfolio.name;
    this.paymentHistory = updatedHistory
      .filter((entry) => entry.portfolioId === portfolio.id)
      .slice(0, 8);
    this.showPaymentHistoryModal = true;
  }

  private readPaymentHistory(): PaymentHistoryEntry[] {
    const raw = localStorage.getItem(this.paymentHistoryStorageKey);
    if (!raw) {
      return [];
    }

    try {
      const parsed = JSON.parse(raw) as PaymentHistoryEntry[];
      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed.filter((entry) =>
        typeof entry?.id === 'string'
        && typeof entry?.portfolioId === 'number'
        && typeof entry?.amount === 'number'
      );
    } catch {
      return [];
    }
  }

  private persistPaymentHistory(history: PaymentHistoryEntry[]): void {
    localStorage.setItem(this.paymentHistoryStorageKey, JSON.stringify(history));
  }
}
