import {Injectable} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PermissionsService} from '../_services/permissions.service';
import {map} from 'rxjs/operators';

@Injectable()
export class PermissionsChangedInterceptor implements HttpInterceptor {

  constructor(private permissionsService: PermissionsService) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      map((value: HttpResponse<any>) => {
        if (value instanceof HttpResponse && value.headers.keys().find(h => h === 'permissions_changed')) {
          this.permissionsService.updatePermissionClaims(this.permissionsService.token.environment_id)
            .subscribe(value1 => {
              console.log('Done!');
            });
        }
        return value;
      })
    );
  }
}

export const PermissionsChangedInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: PermissionsChangedInterceptor,
  multi: true,
  deps: [PermissionsService]
};
