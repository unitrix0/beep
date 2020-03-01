import {Injectable} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(response => {
        if (response instanceof HttpErrorResponse) {
          if (response.status === 401) {
            if (response.error && response.error.status) {
              // Unerwarteter 401
              return throwError(response.error.title);
            }
            // 401 bei Login anfrage
            return throwError(response);
          }

          const applicationError = response.headers.get('Application-Error');
          if (applicationError) {
            console.error(applicationError);
            return throwError(applicationError);
          }

          const serverError = response.error;
          let modalStateErrors = '';
          if (serverError && typeof serverError === 'object') {
            modalStateErrors = '<ul>\n';
            for (const key in serverError) {
              if (serverError[key]) {
                modalStateErrors += '<li>' + serverError[key].description + '</li>\n';
              }
            }
            modalStateErrors += '</ul>';
          }
          return throwError(modalStateErrors || serverError.errors || 'Server Error');
        }
      })
    );
  }
}

export const ErrorInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: ErrorInterceptor,
  multi: true
};
