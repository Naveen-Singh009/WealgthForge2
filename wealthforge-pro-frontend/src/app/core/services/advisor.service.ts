import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../shared/models/api-response.model';
import { Advisor, AllocateAdvisorRequest } from '../../shared/models/advisor.model';
import { InvestorSummary } from '../../shared/models/investor.model';

@Injectable({
  providedIn: 'root',
})
export class AdvisorService {
  private readonly apiBaseUrl = environment.apiBaseUrl;

  constructor(private readonly http: HttpClient) {}

  getAdvisors(): Observable<ApiResponse<Advisor[]>> {
    return this.http.get<Advisor[]>(`${this.apiBaseUrl}/advisor/list/all`).pipe(
      map((advisors) => {
        const sortedAdvisors = [...(advisors ?? [])].sort((first, second) => {
          const firstId = Number(first?.id ?? 0);
          const secondId = Number(second?.id ?? 0);
          return secondId - firstId;
        });

        return {
        success: true,
        message: 'Advisors loaded',
        data: sortedAdvisors,
      };
      })
    );
  }

  allocateAdvisor(payload: AllocateAdvisorRequest): Observable<ApiResponse<void>> {
    return this.http.post<unknown>(`${this.apiBaseUrl}/advisor/assign`, payload).pipe(
      map(() => ({
        success: true,
        message: 'Advisor allocated',
        data: undefined,
      }))
    );
  }

  deallocateAdvisor(payload: AllocateAdvisorRequest): Observable<ApiResponse<void>> {
    return this.http.delete(`${this.apiBaseUrl}/advisor/assign`, {
      params: {
        advisorId: payload.advisorId,
        investorId: payload.investorId,
      },
      responseType: 'text',
    }).pipe(
      map((message) => ({
        success: true,
        message: message || 'Advisor removed',
        data: undefined,
      }))
    );
  }

  getAllocatedAdvisorIds(investorId: number): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiBaseUrl}/advisor/list/investor/${investorId}`).pipe(
      map((advisorIds) => {
        const normalizedAdvisorIds = (advisorIds ?? [])
          .map((id) => Number(id))
          .filter((id) => Number.isInteger(id) && id > 0);

        return Array.from(new Set(normalizedAdvisorIds));
      })
    );
  }

  getAllocatedInvestorIds(advisorId: number): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiBaseUrl}/advisor/list/${advisorId}`).pipe(
      map((investorIds) => {
        const normalizedInvestorIds = (investorIds ?? [])
          .map((id) => Number(id))
          .filter((id) => Number.isInteger(id) && id > 0);

        return Array.from(new Set(normalizedInvestorIds));
      })
    );
  }

  getInvestorsByIds(investorIds: number[]): Observable<InvestorSummary[]> {
    const normalizedInvestorIds = Array.from(new Set(
      (investorIds ?? [])
        .map((id) => Number(id))
        .filter((id) => Number.isInteger(id) && id > 0)
    ));

    if (normalizedInvestorIds.length === 0) {
      return of([]);
    }

    return this.http.get<InvestorSummary[]>(`${this.apiBaseUrl}/investor/list/by-ids`, {
      params: { investorIds: normalizedInvestorIds.join(',') },
    }).pipe(
      map((investors) => investors ?? [])
    );
  }

  askChatbot(question: string): Observable<string> {
    return this.http.get(`${this.apiBaseUrl}/advisor/chatbot/ask`, {
      params: { question },
      responseType: 'text',
    });
  }
}
