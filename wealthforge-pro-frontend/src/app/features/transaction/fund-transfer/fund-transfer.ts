import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { LoadingService } from '../../../core/services/loading.service';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { ToastService } from '../../../core/services/toast.service';
import { Portfolio, TransferFundsRequest } from '../../../shared/models/portfolio.model';

@Component({
  selector: 'app-fund-transfer',
  standalone: false,
  templateUrl: './fund-transfer.html',
  styleUrl: './fund-transfer.scss',
})
export class FundTransferComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly portfolioService = inject(PortfolioService);
  private readonly loadingService = inject(LoadingService);
  private readonly toastService = inject(ToastService);

  readonly transferForm = this.fb.nonNullable.group({
    fromPortfolioId: [0, [Validators.required, Validators.min(1)]],
    toPortfolioId: [0, [Validators.required, Validators.min(1)]],
    amount: [0, [Validators.required, Validators.min(0.01)]],
  });

  portfolios: Portfolio[] = [];
  submitting = false;

  ngOnInit(): void {
    this.loadPortfolios();
  }

  get canTransfer(): boolean {
    return this.portfolios.length > 1;
  }

  loadPortfolios(): void {
    this.loadingService.show();

    this.portfolioService.getInvestorPortfolios().pipe(
      finalize(() => this.loadingService.hide())
    ).subscribe({
      next: (response) => {
        this.portfolios = response.data ?? [];

        const firstPortfolioId = this.portfolios[0]?.id ?? 0;
        const secondPortfolioId = this.portfolios[1]?.id ?? 0;

        this.transferForm.patchValue({
          fromPortfolioId: firstPortfolioId,
          toPortfolioId: secondPortfolioId,
        });
      },
      error: () => {
        this.toastService.show('error', 'Transfer Setup Failed', 'Unable to load portfolios.');
      },
    });
  }

  submit(): void {
    if (this.transferForm.invalid || this.submitting) {
      this.transferForm.markAllAsTouched();
      return;
    }

    if (!this.canTransfer) {
      this.toastService.show('warning', 'Transfer Not Allowed', 'Create at least two portfolios to transfer funds.');
      return;
    }

    const fromPortfolioId = this.transferForm.controls.fromPortfolioId.value;
    const toPortfolioId = this.transferForm.controls.toPortfolioId.value;

    if (fromPortfolioId === toPortfolioId) {
      this.toastService.show('warning', 'Invalid Selection', 'Source and destination portfolios must be different.');
      return;
    }

    const payload: TransferFundsRequest = {
      fromPortfolioId,
      toPortfolioId,
      amount: this.transferForm.controls.amount.value,
    };

    this.submitting = true;
    this.loadingService.show();

    this.portfolioService.transferFunds(payload).pipe(
      finalize(() => {
        this.loadingService.hide();
        this.submitting = false;
      })
    ).subscribe({
      next: (response) => {
        this.toastService.show('success', 'Transfer Completed', response.message || 'Funds transferred successfully.');
        this.transferForm.controls.amount.setValue(0);
        this.loadPortfolios();
      },
      error: (error) => {
        const message =
          error?.error?.message
          ?? error?.error
          ?? error?.message
          ?? 'Unable to transfer funds at this time.';
        this.toastService.show('error', 'Transfer Failed', String(message));
      },
    });
  }
}
