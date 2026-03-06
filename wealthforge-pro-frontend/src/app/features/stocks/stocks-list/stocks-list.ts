import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { AuthService } from '../../../core/services/auth.service';
import { LoadingService } from '../../../core/services/loading.service';
import { StockService } from '../../../core/services/stock.service';
import { ToastService } from '../../../core/services/toast.service';
import { Stock } from '../../../shared/models/stock.model';
import { UserRole } from '../../../shared/models/user.model';

@Component({
  selector: 'app-stocks-list',
  standalone: false,
  templateUrl: './stocks-list.html',
  styleUrl: './stocks-list.scss',
})
export class StocksListComponent implements OnInit {
  private readonly fb = inject(FormBuilder);

  allStocks: Stock[] = [];
  stocks: Stock[] = [];
  query = '';
  watchlist: Stock[] = [];
  selectedTrendStock: Stock | null = null;
  userRole: UserRole | null = null;
  creatingStock = false;
  updatingStock = false;
  deletingStockId: number | null = null;
  editingStockId: number | null = null;

  readonly createStockForm = this.fb.nonNullable.group({
    symbol: ['', [Validators.required, Validators.minLength(1)]],
    name: ['', [Validators.required, Validators.minLength(2)]],
    sector: ['', [Validators.required, Validators.minLength(2)]],
    currentPrice: [0, [Validators.required, Validators.min(0.01)]],
    availableQuantity: [1, [Validators.required, Validators.min(1)]],
  });

  readonly editStockForm = this.fb.nonNullable.group({
    symbol: ['', [Validators.required, Validators.minLength(1)]],
    name: ['', [Validators.required, Validators.minLength(2)]],
    sector: ['', [Validators.required, Validators.minLength(2)]],
    currentPrice: [0, [Validators.required, Validators.min(0.01)]],
    availableQuantity: [1, [Validators.required, Validators.min(1)]],
  });

  constructor(
    private readonly authService: AuthService,
    private readonly stockService: StockService,
    private readonly loadingService: LoadingService,
    private readonly toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.userRole = this.authService.getRole();
    this.loadStocks();
  }

  loadStocks(): void {
    this.loadingService.show();

    this.stockService.getAllStocks().subscribe({
      next: (response) => {
        this.allStocks = response.data ?? [];
        this.stocks = [...this.allStocks];
      },
      error: () => {
        this.toastService.show('error', 'Stocks Error', 'Unable to load market stocks.');
      },
      complete: () => {
        this.loadingService.hide();
      },
    });
  }

  createStock(): void {
    if (this.userRole !== 'ADMIN') {
      return;
    }

    if (this.createStockForm.invalid || this.creatingStock) {
      this.createStockForm.markAllAsTouched();
      return;
    }

    const payload = this.createStockForm.getRawValue();
    this.creatingStock = true;
    this.loadingService.show();

    this.stockService.createStock({
      symbol: payload.symbol.trim().toUpperCase(),
      name: payload.name.trim(),
      sector: payload.sector.trim(),
      currentPrice: payload.currentPrice,
      availableQuantity: payload.availableQuantity,
    }).subscribe({
      next: (response) => {
        this.toastService.show('success', 'Stock Created', response.message);
        this.createStockForm.reset({
          symbol: '',
          name: '',
          sector: '',
          currentPrice: 0,
          availableQuantity: 1,
        });
      },
      error: (error) => {
        const message = this.resolveErrorMessage(error, 'Unable to create stock.');
        this.toastService.show('error', 'Create Failed', message);
        this.loadingService.hide();
        this.creatingStock = false;
      },
      complete: () => {
        this.loadingService.hide();
        this.creatingStock = false;
        this.loadStocks();
      },
    });
  }

  search(): void {
    if (!this.query.trim()) {
      this.loadStocks();
      return;
    }

    this.loadingService.show();

    this.stockService.searchStocks(this.query.trim()).subscribe({
      next: (response) => {
        this.stocks = response.data ?? [];
      },
      error: () => {
        this.toastService.show('warning', 'Search', 'No stocks found for the entered keyword.');
      },
      complete: () => {
        this.loadingService.hide();
      },
    });
  }

  addToWatchlist(stock: Stock): void {
    const exists = this.watchlist.some((item) => item.id === stock.id);
    if (!exists) {
      this.watchlist.push(stock);
      this.toastService.show('success', 'Watchlist Updated', `${stock.symbol} added to watchlist.`);
    }

    this.selectedTrendStock = stock;
  }

  selectTrendStock(stock: Stock): void {
    this.selectedTrendStock = stock;
  }

  beginEdit(stock: Stock): void {
    if (this.userRole !== 'ADMIN') {
      return;
    }

    this.editingStockId = stock.id;
    this.editStockForm.reset({
      symbol: stock.symbol,
      name: stock.name ?? '',
      sector: stock.sector ?? '',
      currentPrice: stock.currentPrice,
      availableQuantity: stock.availableQuantity ?? 1,
    });
  }

  cancelEdit(): void {
    this.editingStockId = null;
    this.updatingStock = false;
    this.editStockForm.reset({
      symbol: '',
      name: '',
      sector: '',
      currentPrice: 0,
      availableQuantity: 1,
    });
  }

  saveEdit(): void {
    if (this.userRole !== 'ADMIN' || this.editingStockId == null) {
      return;
    }

    if (this.editStockForm.invalid || this.updatingStock) {
      this.editStockForm.markAllAsTouched();
      return;
    }

    const payload = this.editStockForm.getRawValue();
    this.updatingStock = true;
    this.loadingService.show();

    this.stockService.updateStock(this.editingStockId, {
      symbol: payload.symbol.trim().toUpperCase(),
      name: payload.name.trim(),
      sector: payload.sector.trim(),
      currentPrice: payload.currentPrice,
      availableQuantity: payload.availableQuantity,
    }).subscribe({
      next: (response) => {
        this.toastService.show('success', 'Stock Updated', response.message);
        this.cancelEdit();
      },
      error: (error) => {
        const message = this.resolveErrorMessage(error, 'Unable to update stock.');
        this.toastService.show('error', 'Update Failed', message);
        this.loadingService.hide();
        this.updatingStock = false;
      },
      complete: () => {
        this.loadingService.hide();
        this.updatingStock = false;
        this.loadStocks();
      },
    });
  }

  deleteEditingStock(): void {
    if (this.userRole !== 'ADMIN' || this.editingStockId == null || this.deletingStockId != null) {
      return;
    }

    const symbol = this.editStockForm.controls.symbol.value?.trim().toUpperCase() || 'this stock';
    const ok = window.confirm(
      `Delete ${symbol} from market master?\n` +
      'This will also remove it from all investor holdings and transfer value to portfolio balance.'
    );
    if (!ok) {
      return;
    }

    const stockId = this.editingStockId;
    this.deletingStockId = stockId;
    this.loadingService.show();

    this.stockService.deleteStock(stockId).subscribe({
      next: (response) => {
        this.toastService.show('success', 'Stock Deleted', response.message || 'Stock deleted successfully.');
        this.cancelEdit();
      },
      error: (error) => {
        const message = this.resolveErrorMessage(error, 'Unable to delete stock.');
        this.toastService.show('error', 'Delete Failed', message);
      },
      complete: () => {
        this.loadingService.hide();
        this.deletingStockId = null;
        this.loadStocks();
      },
    });
  }

  deleteStock(stock: Stock): void {
    if (this.userRole !== 'ADMIN' || this.deletingStockId != null) {
      return;
    }

    const ok = window.confirm(
      `Delete ${stock.symbol} from market master?\n` +
      'This will also remove it from all investor holdings and transfer value to portfolio balance.'
    );
    if (!ok) {
      return;
    }

    this.deletingStockId = stock.id;
    this.loadingService.show();

    this.stockService.deleteStock(stock.id).subscribe({
      next: (response) => {
        this.toastService.show('success', 'Stock Deleted', response.message || 'Stock deleted successfully.');
        if (this.editingStockId === stock.id) {
          this.cancelEdit();
        }
      },
      error: (error) => {
        const message = this.resolveErrorMessage(error, 'Unable to delete stock.');
        this.toastService.show('error', 'Delete Failed', message);
      },
      complete: () => {
        this.loadingService.hide();
        this.deletingStockId = null;
        this.loadStocks();
      },
    });
  }

  get trendStock(): Stock | null {
    if (this.selectedTrendStock) {
      return this.selectedTrendStock;
    }

    if (this.watchlist.length > 0) {
      return this.watchlist[0];
    }

    if (this.allStocks.length > 0) {
      return this.allStocks[0];
    }

    return null;
  }

  get trendVsMarketPercent(): number | null {
    const stock = this.trendStock;
    if (!stock) {
      return null;
    }

    const avg = this.averagePrice(this.allStocks);
    if (avg <= 0) {
      return null;
    }

    return ((stock.currentPrice - avg) / avg) * 100;
  }

  get trendVsSectorPercent(): number | null {
    const stock = this.trendStock;
    if (!stock) {
      return null;
    }

    const sector = (stock.sector ?? '').trim().toLowerCase();
    if (!sector) {
      return null;
    }

    const sectorStocks = this.allStocks.filter(
      (item) => (item.sector ?? '').trim().toLowerCase() === sector
    );

    const avg = this.averagePrice(sectorStocks);
    if (avg <= 0) {
      return null;
    }

    return ((stock.currentPrice - avg) / avg) * 100;
  }

  get trendRankText(): string {
    const stock = this.trendStock;
    if (!stock || this.allStocks.length === 0) {
      return '-';
    }

    const sorted = [...this.allStocks].sort((a, b) => b.currentPrice - a.currentPrice);
    const index = sorted.findIndex((item) => item.symbol === stock.symbol);

    if (index < 0) {
      return '-';
    }

    return `${index + 1} of ${sorted.length}`;
  }

  formatSignedPercent(value: number | null): string {
    if (value == null || Number.isNaN(value)) {
      return '-';
    }

    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  }

  trendClass(value: number | null): string {
    if (value == null) {
      return '';
    }

    if (value > 0) {
      return 'text-profit';
    }

    if (value < 0) {
      return 'text-loss';
    }

    return '';
  }

  private averagePrice(items: Stock[]): number {
    if (!items.length) {
      return 0;
    }

    const total = items.reduce((sum, item) => sum + (item.currentPrice ?? 0), 0);
    return total / items.length;
  }

  private resolveErrorMessage(error: unknown, fallbackMessage: string): string {
    const errorPayload = (error as { error?: unknown })?.error;

    if (typeof errorPayload === 'string' && errorPayload.trim().length > 0) {
      return errorPayload;
    }

    if (errorPayload && typeof errorPayload === 'object') {
      const payloadRecord = errorPayload as Record<string, unknown>;

      const directMessage = payloadRecord['message'];
      if (typeof directMessage === 'string' && directMessage.trim().length > 0) {
        return directMessage;
      }

      const errorText = payloadRecord['error'];
      if (typeof errorText === 'string' && errorText.trim().length > 0) {
        return errorText;
      }

      const firstStringValue = Object.values(payloadRecord).find(
        (value) => typeof value === 'string' && value.trim().length > 0
      ) as string | undefined;
      if (firstStringValue) {
        return firstStringValue;
      }
    }

    const errorMessage = (error as { message?: unknown })?.message;
    if (typeof errorMessage === 'string' && errorMessage.trim().length > 0) {
      return errorMessage;
    }

    return fallbackMessage;
  }
}
