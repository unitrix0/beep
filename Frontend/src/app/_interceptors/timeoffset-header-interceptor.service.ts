import {HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';

@Injectable()
export class TimeOffsetHeaderInterceptor implements HttpInterceptor {
  private readonly timeOffset: number;

  constructor() {
    this.timeOffset = new Date().getTimezoneOffset() * -1;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({headers: req.headers.append('ClientTimezoneOffset', this.timeOffset.toString())});
    return next.handle(req);
  }
}

export const TimeOffsetInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: TimeOffsetHeaderInterceptor,
  multi: true
};
