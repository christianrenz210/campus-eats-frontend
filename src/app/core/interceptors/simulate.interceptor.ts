import { HttpInterceptorFn, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

/** Adds environment.simulate (e.g. 'delay=3000') to every API request. */
export const simulateInterceptor: HttpInterceptorFn = (req, next) => {
  if (!environment.simulate || !req.url.startsWith(environment.apiUrl)) {
    return next(req);
  }

  const extra = new HttpParams({ fromString: environment.simulate });
  const params = extra.keys().reduce(
    (p, key) => p.set(key, extra.get(key) ?? ''),
    req.params
  );
  return next(req.clone({ params }));
};
