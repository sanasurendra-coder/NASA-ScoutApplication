import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AppApiError } from '../models/api-error.model';
import { BYPASS_ERROR_INTERCEPTOR } from './http-context.tokens';
import { APP_MESSAGES } from '../constants/scout-constants';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (req.context.get(BYPASS_ERROR_INTERCEPTOR)) {
        return throwError(() => error);
      }

      let message: string;

      if (error.status === 0) {
        message = APP_MESSAGES.ERRORS.NETWORK_OFFLINE;
      } else if (error.status === 401) {
        message = APP_MESSAGES.ERRORS.UNAUTHORIZED;
      } else if (error.status === 403) {
        message = APP_MESSAGES.ERRORS.FORBIDDEN;
      } else if (error.status === 404) {
        message = APP_MESSAGES.ERRORS.NOT_FOUND;
      } else if (error.status >= 500) {
        message = APP_MESSAGES.ERRORS.SERVER_DOWN;
      } else if (error.error?.message) {
        message = error.error.message;
      } else {
        message = APP_MESSAGES.ERRORS.GENERIC_FALLBACK;
      }

      const standardizedError: AppApiError = {
        status: error.status,
        message,
        code: error.error?.code || `HTTP_${error.status}`,
        timestamp: new Date().toISOString(),
        originalError: error
      };

      return throwError(() => standardizedError);
    })
  );
};
