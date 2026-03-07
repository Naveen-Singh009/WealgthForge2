import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../shared/models/api-response.model';
import { TradeRequest, Transaction } from '../../shared/models/transaction.model';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private readonly apiBaseUrl = environment.apiBaseUrl;

  constructor(private readonly http: HttpClient) {}

  buyAsset(payload: TradeRequest): Observable<ApiResponse<void>> {
    return this.http.post(`${this.apiBaseUrl}/investor/buy`, {
      portfolioId: payload.portfolioId,
      symbol: payload.symbol,
      quantity: payload.quantity,
    }, { responseType: 'text' }).pipe(
      map((message) => ({
        success: true,
        message: message || 'Buy order placed successfully.',
        data: undefined,
      }))
    );
  }

  sellAsset(payload: TradeRequest): Observable<ApiResponse<void>> {
    return this.http.post(`${this.apiBaseUrl}/investor/sell`, {
      portfolioId: payload.portfolioId,
      assetName: payload.symbol,
      quantity: payload.quantity,
    }, { responseType: 'text' }).pipe(
      map((message) => ({
        success: true,
        message: message || 'Sell order placed successfully.',
        data: undefined,
      }))
    );
  }

  getInvestorTransactions(_investorId?: number, fromDate?: string, toDate?: string): Observable<ApiResponse<Transaction[]>> {
    let params = new HttpParams();

    if (fromDate) {
      params = params.set('fromDate', fromDate);
    }
    if (toDate) {
      params = params.set('toDate', toDate);
    }

    return this.http.get<ApiResponse<Transaction[]>>(`${this.apiBaseUrl}/investor/history`, { params });
  }
}
