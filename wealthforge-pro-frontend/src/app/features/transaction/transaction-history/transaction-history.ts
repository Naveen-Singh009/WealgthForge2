import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { LoadingService } from '../../../core/services/loading.service';
import { ToastService } from '../../../core/services/toast.service';
import { TransactionService } from '../../../core/services/transaction.service';
import { Transaction } from '../../../shared/models/transaction.model';

@Component({
  selector: 'app-transaction-history',
  standalone: false,
  templateUrl: './transaction-history.html',
  styleUrl: './transaction-history.scss',
})
export class TransactionHistoryComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly transactionService = inject(TransactionService);
  private readonly loadingService = inject(LoadingService);
  private readonly toastService = inject(ToastService);

  transactions: Transaction[] = [];

  readonly filterForm = this.fb.nonNullable.group({
    fromDate: [''],
    toDate: [''],
  });

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    const { fromDate, toDate } = this.filterForm.getRawValue();

    if (fromDate && toDate && fromDate > toDate) {
      this.toastService.show('warning', 'Invalid Date Range', '"From" date cannot be after "To" date.');
      return;
    }

    this.loadingService.show();

    this.transactionService.getInvestorTransactions(undefined, fromDate || undefined, toDate || undefined).subscribe({
      next: (response) => {
        const allTransactions = response.data ?? [];
        this.transactions = this.applyDateFilter(allTransactions, fromDate, toDate);
      },
      error: () => {
        this.toastService.show('error', 'History Error', 'Unable to fetch transaction history.');
      },
      complete: () => {
        this.loadingService.hide();
      },
    });
  }

  private applyDateFilter(transactions: Transaction[], fromDate: string, toDate: string): Transaction[] {
    const fromBoundary = fromDate ? this.toStartOfDay(fromDate) : null;
    const toBoundary = toDate ? this.toEndOfDay(toDate) : null;

    if (!fromBoundary && !toBoundary) {
      return transactions;
    }

    return transactions.filter((tx) => {
      const txDate = new Date(tx.timestamp);
      if (Number.isNaN(txDate.getTime())) {
        return false;
      }
      if (fromBoundary && txDate < fromBoundary) {
        return false;
      }
      if (toBoundary && txDate > toBoundary) {
        return false;
      }
      return true;
    });
  }

  private toStartOfDay(dateValue: string): Date {
    const [year, month, day] = dateValue.split('-').map(Number);
    return new Date(year, month - 1, day, 0, 0, 0, 0);
  }

  private toEndOfDay(dateValue: string): Date {
    const [year, month, day] = dateValue.split('-').map(Number);
    return new Date(year, month - 1, day, 23, 59, 59, 999);
  }
}
