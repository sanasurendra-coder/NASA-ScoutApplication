import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api-endpoints.constant';
import { ScoutApiResponse, ScoutCandidate } from '../models/scout.model';
import {environment} from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ScoutService {
  private readonly http = inject(HttpClient);
  private readonly scoutUrl = `${environment.nasaScoutApiBaseUrl}${API_ENDPOINTS.SCOUT}`;

  getCandidates(): Observable<ScoutCandidate[]> {
    return this.http.get<ScoutApiResponse>(this.scoutUrl).pipe(
      map(response =>
        (response.data || []).map(candidate => ({
          ...candidate,
          hazardAssessment: this.calculateRisk(Number(candidate.rating), Number(candidate.score))
        }))
      )
    );
  }

  private calculateRisk(rating: number, score: number): 'Low Risk' | 'Monitored' | 'Elevated Alert' {
    if (rating >= 3 || score >= 50) {
      return 'Elevated Alert';
    }
    if (rating >= 1 || score > 0) {
      return 'Monitored';
    }
    return 'Low Risk';
  }
}
