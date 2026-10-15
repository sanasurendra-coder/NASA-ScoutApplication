import { Observable, throwError } from 'rxjs';
import { AppApiError } from '../models/api-error.model';

export function enrichError(error: AppApiError, customFeMessage?: string): Observable<never> {
  const enhancedError: AppApiError = {
    ...error,
    message: customFeMessage || error.message
  };

  return throwError(() => enhancedError);
}
