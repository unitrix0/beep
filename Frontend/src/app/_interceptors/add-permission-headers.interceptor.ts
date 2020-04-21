import {Injectable} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PermissionsService} from '../_services/permissions.service';

@Injectable()
export class AddPermissionHeadersInterceptor implements HttpInterceptor {

  constructor(private permissionsService: PermissionsService) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.permissionsService.isUpdating) {
      const newReqNoSerial = request.clone({headers: request.headers.set('permissions_serial', 'updating')});
      return next.handle(newReqNoSerial);
    }

    if (this.permissionsService.token) {
      const newReq = request.clone({
        headers: request.headers
          .set('permissions_serial', this.permissionsService?.token.permissions_serial)
          .set('environment_id', this.permissionsService?.token.environment_id.toString())
      });

      return next.handle(newReq);
    }
    return  next.handle(request);
  }
}

export const PermissionHeadersInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: AddPermissionHeadersInterceptor,
  multi: true
};
