import {Injectable} from '@angular/core';
import {PermissionFlags} from '../_enums/permission-flags.enum';
import {JwtHelperService} from '@auth0/angular-jwt';
import {PermissionToken} from '../_models/permission-token';
import {AuthService} from './auth.service';
import {LocalStorageItemNames} from '../_enums/token-names.enum';
import {Observable} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {


  /**
   * Verfügbare Permission Flags
   */
  public flags = PermissionFlags;
  public token: PermissionToken;
  private baseUrl = environment.apiUrl + 'auth/';

  constructor(private jwtHelper: JwtHelperService, authService: AuthService, private http: HttpClient) {
    authService.onLogout.subscribe(() => {
      localStorage.removeItem(LocalStorageItemNames.permissionsToken);
    });
    authService.onLogin.subscribe(() => this.reloadToken());
  }

  /**
   * Prüft ob der Benutzer eines der übergebenen Flags (OR) gesetzt hat
   * @param orFlags Parameter Array der erlaubten Flags
   */
  hasPermissionOr(...orFlags: PermissionFlags[]): boolean {
    let reqFlags: PermissionFlags = 0;
    orFlags.forEach(f => reqFlags |= f);

    // console.log('env:' + this.token.environment_id + ' userPerm:' + this.token.permissions +
    //   ' req:' + reqFlags + ' (' + orFlags.map(f => f).toString() + ') => ' + (this.token.permissions & reqFlags));
    return (this.token.permissions & reqFlags) !== 0;
  }

  /**
   * Lädt und entschlüsselt den Token erneut aus dem LocalStorage
   */
  reloadToken() {
    const token = this.jwtHelper.decodeToken(localStorage.getItem(LocalStorageItemNames.permissionsToken));
    if (token) {
      console.log(token.permissions);
      this.token = new class implements PermissionToken {
        userId = token.nameid;
        environment_id = parseInt(token.environment_id, 10);
        permission_serial = token.permission_serial;
        permissions = parseInt(token.permissions, 2);
      };
    }
  }

  /**
   * Fragt einen neuen Permissisons Token vom Server ab für das angegebene Environment
   * @param newEnvironmentId ID des Environment für das die Berechtigungen benötigt werden
   */
  updatePermissionClaims(newEnvironmentId: number): Observable<void> {
    const params = new HttpParams()
      .append('environmentId', newEnvironmentId.toString());

    return this.http.get(this.baseUrl + 'UpdatePermissionClaims/' + this.token.userId, {params: params})
      .pipe(
        map((response: any) => {
          if (response) {
            localStorage.setItem(LocalStorageItemNames.permissionsToken, response.permissionsToken);
            this.reloadToken();
          }
        })
      );
  }
}
