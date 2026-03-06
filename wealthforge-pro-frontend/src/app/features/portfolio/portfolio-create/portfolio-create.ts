import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { LoadingService } from '../../../core/services/loading.service';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { ToastService } from '../../../core/services/toast.service';
import { Portfolio } from '../../../shared/models/portfolio.model';

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
  selector: 'app-portfolio-create',
  standalone: false,
  templateUrl: './portfolio-create.html',
  styleUrl: './portfolio-create.scss',
})
export class PortfolioCreateComponent {
  private readonly fb = inject(FormBuilder);
  private readonly paymentHistoryStorageKey = 'wf_portfolio_payment_history';
  private readonly portfolioService = inject(PortfolioService);
  private readonly loadingService = inject(LoadingService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

  submitting = false;
  showPaymentHistoryModal = false;
  paymentHistory: PaymentHistoryEntry[] = [];
  activePaymentPortfolioName = '';
  activePaymentAmount = 0;
  pendingPaymentId: string | null = null;

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    balance: [1000, [Validators.required, Validators.min(0)]],
  });

  submit(): void {
    if (this.form.invalid || this.submitting) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.loadingService.show();

    const payload = this.form.getRawValue();
    const openingBalance = Number(payload.balance ?? 0);

    this.portfolioService.createPortfolio(payload).subscribe({
      next: (response) => {
        const createdPortfolio = response?.data;
        if (openingBalance > 0) {
          this.openPaymentHistorySection(openingBalance, createdPortfolio, payload.name);
        } else {
          this.toastService.show('success', 'Portfolio Created', 'New portfolio has been created.');
          this.router.navigate(['/investor/portfolio']);
        }
      },
      error: (error) => {
        const message = error?.error?.message ?? error?.error ?? 'Unable to create portfolio.';
        this.toastService.show('error', 'Create Failed', String(message));
        this.loadingService.hide();
        this.submitting = false;
      },
      complete: () => {
        this.loadingService.hide();
        this.submitting = false;
      },
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
    this.router.navigate(['/investor/portfolio']);
  }

  private openPaymentHistorySection(amount: number, portfolio: Portfolio | undefined, fallbackName: string): void {
    const portfolioId = portfolio?.id ?? 0;
    const portfolioName = (portfolio?.name ?? fallbackName ?? '').trim() || 'New Portfolio';
    const history = this.readPaymentHistory();
    const pendingPaymentEntry: PaymentHistoryEntry = {
      id: `${portfolioId}-${Date.now()}`,
      portfolioId,
      portfolioName,
      amount,
      method: 'NetBanking',
      status: 'Pending',
      paidAt: new Date().toISOString(),
    };

    const updatedHistory = [pendingPaymentEntry, ...history];
    this.persistPaymentHistory(updatedHistory);

    this.pendingPaymentId = pendingPaymentEntry.id;
    this.activePaymentAmount = amount;
    this.activePaymentPortfolioName = portfolioName;
    this.paymentHistory = updatedHistory
      .filter((entry) => entry.portfolioId === portfolioId)
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
