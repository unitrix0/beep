import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {PermissionFlags} from '../_enums/permission-flags.enum';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {

  /**
   * Verfügbare Permission Flags
   */
  public flags = PermissionFlags;

  constructor(private authService: AuthService) {
  }

  /**
   * Prüft ob eines der übergebenen Flags (OR) gesetzt ist
   * @param orFlags Parameter Array der erlaubten Flags
   */
  public hasPermissionOr(...orFlags: PermissionFlags[]): boolean {
    const userPermissions = parseInt(this.authService.decodedToken.permissions, 2);
    let reqFlags: PermissionFlags = 0;
    orFlags.forEach(f => reqFlags |= f);

    console.log(this.authService.decodedToken.environment_id + ' user:' + this.authService.decodedToken.permissions +
      ' req:' + reqFlags + ' (' + orFlags.map(f => f).toString() + ') => ' + (userPermissions & reqFlags));
    return (userPermissions & reqFlags) !== 0;
  }
}
