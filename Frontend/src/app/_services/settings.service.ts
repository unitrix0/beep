import {Injectable} from '@angular/core';
import {JwtHelperService} from '@auth0/angular-jwt';
import {AuthService} from './auth.service';
import {UsersService} from './users.service';
import {AlertifyService} from './alertify.service';
import {UserSettings} from '../_models/user-settings';
import {LocalStorageItemNames} from '../_enums/token-names.enum';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private settings: UserSettings;

  constructor(private jwtHelper: JwtHelperService, private authService: AuthService, private userSvc: UsersService,
              private alertify: AlertifyService) {
    authService.onLogin.subscribe(() => this.reloadSettings());
    authService.onLogout.subscribe(() => localStorage.removeItem(LocalStorageItemNames.settings));
  }

  get cameraDeviceId(): string {
    return this.settings.cameraDeviceId;
  }

  reloadSettings() {
    const settingsJson = localStorage.getItem(LocalStorageItemNames.settings);
    if (settingsJson) {
      this.settings = JSON.parse(settingsJson);
    }
  }

  saveSelectedCam(device: MediaDeviceInfo) {
    this.userSvc.addCamForUser(this.authService.decodedToken.nameid, device)
      .subscribe((cam) => {
        this.settings.cameraDeviceId = cam.deviceId;
        localStorage.setItem(LocalStorageItemNames.settings, JSON.stringify(this.settings));
        this.alertify.success('Einstellung gespeichert');
      }, error => {
        this.alertify.error('Einstellung konnte nicht gespeichert werden: ' + error.message);
      });
  }
}

