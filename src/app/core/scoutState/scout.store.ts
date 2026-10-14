import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { ScoutService } from '../services/scout.service';
import { ScoutCandidate, ContactInquiry, SubmissionStatus } from '../models/scout.model';
import { CONTACT_FORM_CONFIG } from '../constants/scout-constants';

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

    loadCandidates(): void {
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
    },

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
      } catch (err: any) {
        patchState(store, {
          contactStatus: 'error',
          contactError: err?.message || CONTACT_FORM_CONFIG.GENERIC_FAILURE
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
