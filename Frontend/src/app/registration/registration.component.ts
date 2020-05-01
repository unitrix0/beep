import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {UserForRegistration} from '../_models/user-for-registration';
import {AuthService} from '../_services/auth.service';
import {UserForLogin} from '../_models/user-for-login';
import {Router} from '@angular/router';
import {AlertifyService} from '../_services/alertify.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})

export class RegistrationComponent implements OnInit {
  @Output() cancelRegistration = new EventEmitter();
  model: UserForRegistration = {displayName: '', email: '', password: '', username: ''};
  confirmPw: string;

  constructor(private authService: AuthService, private router: Router, private alertify: AlertifyService) {
  }

  ngOnInit() {
  }

  cancel() {
    this.cancelRegistration.emit();
  }

  register() {
    this.authService.register(this.model).subscribe(createdUser => {
      this.alertify.success('Willkommen bei Beep!');

      const user: UserForLogin = new class implements UserForLogin {
        cameras: MediaDeviceInfo[];
        password: string;
        username: string;
      };
      user.username = this.model.username;
      user.password = this.model.password;
      user.cameras = [];

      this.authService.login(user).subscribe(value => {
        this.alertify.success('Anmeldung erfolgreich!');
        this.router.navigate(['users', createdUser.id]).catch(reason => {
          console.log('Navigation failed: ' + reason);
        });
      });
    }, error => {
      this.alertify.error('Registrierung fehlgeschlagen: ' + error);
    });
  }
}
