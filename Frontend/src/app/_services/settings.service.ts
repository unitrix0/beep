import {Injectable} from '@angular/core';
import {JwtHelperService} from '@auth0/angular-jwt';
import {AuthService} from './auth.service';
import {UsersService} from './users.service';
import {UserSettings} from '../_models/user-settings';
import {LocalStorageItemNames} from '../_enums/local-storage-item-names.enum';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private settings: UserSettings;

  constructor(private jwtHelper: JwtHelperService, private authService: AuthService, private userSvc: UsersService) {
    authService.onLogin.subscribe(() => this.reloadSettings());
    authService.onLogout.subscribe(() => localStorage.removeItem(LocalStorageItemNames.settings));
  }

  get cameraDeviceId(): string {
    return this.settings.cameraDeviceId;
  }

  get cameraLabel(): string {
    return this.settings.cameraLabel;
  }

  reloadSettings() {
    const settingsJson = localStorage.getItem(LocalStorageItemNames.settings);
    if (settingsJson) {
      this.settings = JSON.parse(settingsJson);
    }
  }

  saveSelectedCam(device: MediaDeviceInfo): Observable<void> {
    return this.userSvc.addCamForUser(this.authService.decodedToken.nameid, device, this.settings.cameraDeviceId)
      .pipe(map(cam => {
        this.settings.cameraDeviceId = cam.deviceId;
        this.settings.cameraLabel = cam.label;
        localStorage.setItem(LocalStorageItemNames.settings, JSON.stringify(this.settings));
      }));
  }
}

