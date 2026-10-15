import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { inject } from '@angular/core';
import { pipe, switchMap, tap, catchError, of } from 'rxjs';
import { ScoutService } from '../services/scout.service';
import { ScoutCandidate, ContactInquiry, SubmissionStatus } from '../models/scout.model';
import { AppApiError } from '../models/api-error.model';
import { CONTACT_FORM_CONFIG, APP_MESSAGES } from '../constants/scout-constants';

export interface ScoutState {
  candidates: ScoutCandidate[];
  selectedCandidate: ScoutCandidate | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  contactStatus: SubmissionStatus;
  lastSubmittedInquiry: ContactInquiry | null;
  contactError: string | null;
}

const initialState: ScoutState = {
  candidates: [],
  selectedCandidate: null,
  isLoading: false,
  error: null,
  lastUpdated: null,
  contactStatus: 'idle',
  lastSubmittedInquiry: null,
  contactError: null
};

export const ScoutStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, scoutService = inject(ScoutService)) => ({
    setSelectedCandidate(candidate: ScoutCandidate | null): void {
      patchState(store, { selectedCandidate: candidate });
    },

    loadCandidates: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap(() =>
          scoutService.getCandidates().pipe(
            tap((candidates) => {
              patchState(store, {
                candidates, // <-- passed directly without .data
                isLoading: false,
                lastUpdated: new Date()
              });
            }),
            catchError((err: AppApiError) => {
              patchState(store, {
                error: err?.message || APP_MESSAGES.ERRORS.GENERIC_FALLBACK,
                isLoading: false
              });
              return of(null);
            })
          )
        )
      )
    ),

    async submitInquiry(inquiry: ContactInquiry): Promise<boolean> {
      patchState(store, { contactStatus: 'submitting', contactError: null });

      try {
        await new Promise((resolve) => setTimeout(resolve, CONTACT_FORM_CONFIG.SIMULATED_DELAY_MS));

        if (inquiry.email.toLowerCase().includes('fail')) {
          throw new Error(CONTACT_FORM_CONFIG.SIMULATED_GATEWAY_REJECT);
        }

        patchState(store, {
          contactStatus: 'success',
          lastSubmittedInquiry: inquiry,
          contactError: null
        });
        return true;
      } catch (err: unknown) {
        const fallbackMessage = err instanceof Error ? err.message : CONTACT_FORM_CONFIG.GENERIC_FAILURE;
        patchState(store, {
          contactStatus: 'error',
          contactError: fallbackMessage
        });
        return false;
      }
    },

    resetContactForm(): void {
      patchState(store, {
        contactStatus: 'idle',
        contactError: null
      });
    }
  }))
);
