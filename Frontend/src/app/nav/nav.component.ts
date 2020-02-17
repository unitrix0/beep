import {Component, ViewChild} from '@angular/core';
import {UserForLogin} from '../_models/user-for-login';
import {Router} from '@angular/router';
import {AlertifyService} from '../_services/alertify.service';
import {UsersService} from '../_services/users.service';
import {AuthService} from '../_services/auth.service';
import {ZXingScannerComponent} from '@zxing/ngx-scanner';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {
  @ViewChild('loginForm') loginForm: NgForm;
  user: UserForLogin = new class implements UserForLogin {
    cameras: MediaDeviceInfo[];
    password: string;
    username: string;
  };
  invitationsCount: any;

  constructor(private authService: AuthService, private router: Router, private alertify: AlertifyService,
              private usersService: UsersService) {
    this.usersService.invitationsCountUpdated.subscribe(count => {
      if (count > 0) {
        alertify.success('Sie haben neue Einladungen!');
      }
      this.invitationsCount = count;
    });
  }

  login() {
    this.fillInCameras().then(success => {
      if (success) {
        this.authService.login(this.user).subscribe(() => {
          this.loginForm.resetForm();
          this.alertify.success('Anmeldung erfolgreich');
          this.router.navigate(['scan']);
        }, error => {
          this.alertify.error('Anmeldung fehlgeschlagen. Benutzername oder Passwort falsch.');
          // TODO Error Handling
          console.log(error);
        });
      }
    });
  }

  loggedIn(): boolean {
    return this.authService.loggedIn();
  }

  logout() {
    this.authService.logout();
  }

  private fillInCameras(): Promise<boolean> {
    const scanner: ZXingScannerComponent = new ZXingScannerComponent();
    return scanner.updateVideoInputDevices().then(devices => {
      this.user.cameras = devices;
      return true;
    }).catch(reason => {
      this.alertify.error('Die Liste der verfügbaren Kameras konnte nicht abgefragt werden: ' + reason.message);
      return false;
    });
  }
}
