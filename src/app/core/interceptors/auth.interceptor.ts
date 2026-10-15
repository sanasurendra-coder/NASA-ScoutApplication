import { HttpInterceptorFn } from '@angular/common/http';
import { BYPASS_AUTH } from './http-context.tokens';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const isBypassed = req.context.get(BYPASS_AUTH);
  if (isBypassed) {
    return next(req);
  }
  const authReq = req.clone({
    setHeaders: {
      Authorization: 'Bearer mock-jwt-token'
    }
  });

  return next(authReq);
};
