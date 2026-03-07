import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, forkJoin } from 'rxjs';

import { LoadingService } from '../../../core/services/loading.service';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { StockService } from '../../../core/services/stock.service';
import { ToastService } from '../../../core/services/toast.service';
import { TransactionService } from '../../../core/services/transaction.service';
import { Portfolio } from '../../../shared/models/portfolio.model';
import { Stock } from '../../../shared/models/stock.model';
import { TradeRequest } from '../../../shared/models/transaction.model';

@Component({
  selector: 'app-buy-sell',
  standalone: false,
  templateUrl: './buy-sell.html',
  styleUrl: './buy-sell.scss',
})
export class BuySellComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly portfolioService = inject(PortfolioService);
  private readonly stockService = inject(StockService);
  private readonly transactionService = inject(TransactionService);
  private readonly loadingService = inject(LoadingService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

  readonly tradeForm = this.fb.nonNullable.group({
    type: ['BUY' as 'BUY' | 'SELL', [Validators.required]],
    portfolioId: [0, [Validators.required, Validators.min(1)]],
    symbol: ['', [Validators.required, Validators.minLength(1)]],
    quantity: [1, [Validators.required, Validators.min(1)]],
  });

  portfolios: Portfolio[] = [];
  stocks: Stock[] = [];
  filteredStocks: Stock[] = [];
  stockSearch = '';
  submitting = false;

  ngOnInit(): void {
    this.loadTradeContext();
  }

  loadTradeContext(): void {
    this.loadingService.show();

    forkJoin({
      portfolios: this.portfolioService.getInvestorPortfolios(),
      stocks: this.stockService.getAllStocks(),
    }).pipe(
      finalize(() => this.loadingService.hide())
    ).subscribe({
      next: ({ portfolios, stocks }) => {
        this.portfolios = portfolios.data ?? [];
        this.stocks = stocks.data ?? [];
        this.filteredStocks = [...this.stocks];

        if (this.portfolios.length > 0 && this.tradeForm.controls.portfolioId.value < 1) {
          this.tradeForm.controls.portfolioId.setValue(this.portfolios[0].id);
        }
      },
      error: () => {
        this.toastService.show('error', 'Trade Setup Failed', 'Unable to load portfolios or stocks.');
      },
    });
  }

  searchStocks(): void {
    const query = this.stockSearch.trim().toLowerCase();

    if (!query) {
      this.filteredStocks = [...this.stocks];
      return;
    }

    this.filteredStocks = this.stocks.filter((stock) =>
      stock.symbol.toLowerCase().includes(query) ||
      (stock.name ?? '').toLowerCase().includes(query) ||
      (stock.sector ?? '').toLowerCase().includes(query)
    );
  }

  chooseStockForBuy(stock: Stock): void {
    this.tradeForm.patchValue({
      type: 'BUY',
      symbol: stock.symbol.toUpperCase(),
    });
  }

  normalizeQuantity(): void {
    const control = this.tradeForm.controls.quantity;
    const quantity = Number(control.value);
    if (!Number.isFinite(quantity) || quantity < 1) {
      control.setValue(1);
    }
  }

  submit(): void {
    this.normalizeQuantity();

    if (this.tradeForm.invalid || this.submitting) {
      this.tradeForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.loadingService.show();

    const tradeType = this.tradeForm.controls.type.value;
    const selectedPortfolioId = this.tradeForm.controls.portfolioId.value;
    const payload: TradeRequest = {
      portfolioId: selectedPortfolioId,
      symbol: this.tradeForm.controls.symbol.value.trim().toUpperCase(),
      quantity: this.tradeForm.controls.quantity.value,
    };

    const operation =
      tradeType === 'BUY'
        ? this.transactionService.buyAsset(payload)
        : this.transactionService.sellAsset(payload);

    operation.pipe(
      finalize(() => {
        this.loadingService.hide();
        this.submitting = false;
      })
    ).subscribe({
      next: (response) => {
        this.toastService.show('success', 'Trade Executed', response.message || `${tradeType} order placed successfully.`);
        if (tradeType === 'SELL' && selectedPortfolioId > 0) {
          this.router.navigate(['/portfolio', selectedPortfolioId]);
        }
      },
      error: (error) => {
        const message = this.resolveTradeErrorMessage(error);
        this.toastService.show('error', 'Trade Failed', message);
      },
    });
  }

  private resolveTradeErrorMessage(error: unknown): string {
    const fallback = 'Unable to execute trade at this time.';
    const rawMessage = this.extractErrorText(error, fallback);
    const businessMessage = this.extractNestedBusinessMessage(rawMessage) ?? rawMessage;

    if (/insufficient balance/i.test(businessMessage)) {
      const balanceMatch = businessMessage.match(/Available:\s*([0-9.]+)\s*,\s*Required:\s*([0-9.]+)/i);
      if (!balanceMatch) {
        return 'Insufficient balance. Please add funds or reduce quantity.';
      }

      const available = Number(balanceMatch[1]);
      const required = Number(balanceMatch[2]);
      if (!Number.isFinite(available) || !Number.isFinite(required)) {
        return 'Insufficient balance. Please add funds or reduce quantity.';
      }

      const amountFormatter = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 });
      return `Insufficient balance. Available: ₹${amountFormatter.format(available)}, Required: ₹${amountFormatter.format(required)}.`;
    }

    return businessMessage;
  }

  private extractErrorText(error: unknown, fallback: string): string {
    const typedError = error as {
      error?: { message?: unknown; error?: unknown } | string;
      message?: unknown;
    };

    const nestedMessage = (typedError?.error as { message?: unknown } | undefined)?.message;
    if (typeof nestedMessage === 'string' && nestedMessage.trim()) {
      return nestedMessage.trim();
    }

    const nestedError = (typedError?.error as { error?: unknown } | undefined)?.error;
    if (typeof nestedError === 'string' && nestedError.trim()) {
      return nestedError.trim();
    }

    if (typeof typedError?.error === 'string' && typedError.error.trim()) {
      return typedError.error.trim();
    }

    if (typeof typedError?.message === 'string' && typedError.message.trim()) {
      return typedError.message.trim();
    }

    return fallback;
  }

  private extractNestedBusinessMessage(rawMessage: string): string | null {
    const source = rawMessage.replace(/\\"/g, '"');
    const regex = /"message":"([^"]+)"/g;
    let latestMessage: string | null = null;
    let match: RegExpExecArray | null = regex.exec(source);

    while (match) {
      const value = match[1]?.trim();
      if (value) {
        latestMessage = value;
      }
      match = regex.exec(source);
    }

    return latestMessage;
  }
}
