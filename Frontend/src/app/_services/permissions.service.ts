import {Injectable} from '@angular/core';
import {PermissionFlags} from '../_enums/permission-flags.enum';
import {JwtHelperService} from '@auth0/angular-jwt';
import {PermissionToken} from '../_models/permission-token';
import {AuthService} from './auth.service';
import {LocalStorageItemNames} from '../_enums/token-names.enum';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {


  /**
   * Verfügbare Permission Flags
   */
  public flags = PermissionFlags;
  permissionToken: PermissionToken;

  constructor(private jwtHelper: JwtHelperService, authService: AuthService) {
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

    console.log(this.permissionToken.environment_id + ' user:' + this.permissionToken.permissions +
      ' req:' + reqFlags + ' (' + orFlags.map(f => f).toString() + ') => ' + (this.permissionToken.permissions & reqFlags));
    return (this.permissionToken.permissions & reqFlags) !== 0;
  }

  reloadToken() {
    const token = this.jwtHelper.decodeToken(localStorage.getItem(LocalStorageItemNames.permissionsToken));
    if (token) {
      this.permissionToken = new class implements PermissionToken {
        environment_id = parseInt(token.environment_id, 10);
        permission_serial = token.permission_serial;
        permissions = parseInt(token.permissions, 2);
      };
    }
  }
}
