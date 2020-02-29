import {Component, TemplateRef, ViewChild} from '@angular/core';
import {UserForLogin} from '../_models/user-for-login';
import {Router} from '@angular/router';
import {AlertifyService} from '../_services/alertify.service';
import {UsersService} from '../_services/users.service';
import {AuthService} from '../_services/auth.service';
import {ZXingScannerComponent} from '@zxing/ngx-scanner';
import {NgForm} from '@angular/forms';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {
  @ViewChild('loginForm') loginForm: NgForm;
  @ViewChild('notActivatedDlg') notActivatedDlg: TemplateRef<any>;
  private invitationsCount: any;
  private modalRef: BsModalRef;
  private user: UserForLogin = new class implements UserForLogin {
    cameras: MediaDeviceInfo[];
    password: string;
    username: string;
  };

  constructor(private authService: AuthService, private router: Router, private alertify: AlertifyService,
              private usersService: UsersService, private modalService: BsModalService) {
    this.usersService.invitationsCountUpdated.subscribe(count => {
      this.invitationsCount = count;
      if (count > 0) {
        alertify.success('Sie haben neue Einladungen!');
      }
    });
  }

  login() {
    this.fillInCameras().then(success => {
      if (success) {
        this.authService.login(this.user).subscribe(() => {
          this.loginForm.resetForm();
          this.alertify.success('Anmeldung erfolgreich');
          this.router.navigate(['scan']);
        }, response => {
          console.log(response.error);
          if (response.error.isLockedOut) {
            this.alertify.error('Anmeldung fehlgeschlagen: Konto gesperrt');
          } else if (response.error.isNotAllowed) {
            this.modalRef = this.modalService.show(this.notActivatedDlg, {ignoreBackdropClick: true});
          } else {
            this.alertify.error('Anmeldung fehlgeschlagen: Benutzername oder Passwort falsch');
          }

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

  resendConfirmation() {
    this.authService.resendEmailConfirmation(this.user.username)
      .subscribe(value => {
        this.modalRef.hide();
        this.alertify.success('Nachricht gesendet');
      }, error => {
        this.alertify.error('Nachricht konnte nicht gesendet werden: ' + error.mssage);
      });
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
