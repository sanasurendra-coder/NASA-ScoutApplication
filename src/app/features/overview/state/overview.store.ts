import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { ScoutService } from '../../../core/services/scout.service';
import { ScoutCandidate } from '../../../core/models/scout.model';

export interface OverviewState {
  candidates: ScoutCandidate[];
  selectedCandidate: ScoutCandidate | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

const initialState: OverviewState = {
  candidates: [],
  selectedCandidate: null,
  isLoading: false,
  error: null,
  lastUpdated: null
};

export const OverviewStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, scoutService = inject(ScoutService)) => ({
    setSelectedCandidate(candidate: ScoutCandidate | null) {
      patchState(store, { selectedCandidate: candidate });
    },

    loadCandidates() {
      patchState(store, { isLoading: true, error: null });

      scoutService.getCandidates().subscribe({
        next: (data) => {
          patchState(store, {
            candidates: data,
            isLoading: false,
            lastUpdated: new Date()
          });
        },
        error: (err) => {
          patchState(store, {
            error: err?.message || 'Failed to retrieve orbital data from NASA.',
            isLoading: false
          });
        }
      });
    }
  }))
);
