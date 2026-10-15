import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { ScoutCandidate, ContactInquiry } from '../models/scout.model';
import { AppApiError } from '../models/api-error.model';
import { BYPASS_AUTH } from '../interceptors/http-context.tokens';
import { enrichError } from '../utils/error-handler.util';
import { APP_MESSAGES } from '../constants/scout-constants';

interface NasaJplResponse {
  count: number;
  fields?: string[];
  data: any[];
}

@Injectable({
  providedIn: 'root'
})
export class ScoutService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api-scout';

  getCandidates(): Observable<ScoutCandidate[]> {
    return this.http
      .get<NasaJplResponse>(`${this.baseUrl}/scout.api`, {
        context: new HttpContext().set(BYPASS_AUTH, true)
      })
      .pipe(
        map((response) => {
          if (!response?.data) {
            return [];
          }

          if (response.fields && Array.isArray(response.data[0])) {
            return response.data.map((row: any[]) => {
              const record: Record<string, any> = {};
              response.fields!.forEach((field, index) => {
                record[field] = row[index];
              });
              return record as ScoutCandidate;
            });
          }

          return response.data as ScoutCandidate[];
        }),
        catchError((error: AppApiError) =>
          enrichError(error, APP_MESSAGES.ERRORS.TELEMETRY_SYNC)
        )
      );
  }

  submitContactInquiry(payload: ContactInquiry): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>('/api/contact', payload).pipe(
      catchError((error: AppApiError) =>
        enrichError(error, APP_MESSAGES.ERRORS.INQUIRY_DISPATCH)
      )
    );
  }
}
