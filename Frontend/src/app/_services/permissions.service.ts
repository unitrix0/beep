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
  private readonly userPermissions: number;

  private cnt = 0;

  constructor(authService: AuthService) {
    this.userPermissions = parseInt(authService.decodedToken.permissions, 2);
  }

  /**
   * Prüft ob eines der übergebenen Flags (OR) gesetzt ist
   * @param orFlags Parameter Array der erlaubten Flags
   */
  public hasPermissionOr(...orFlags: PermissionFlags[]): boolean {
    let flags: PermissionFlags;
    orFlags.forEach(f => flags |= f);

    return (this.userPermissions & flags) !== 0;
  }
}
