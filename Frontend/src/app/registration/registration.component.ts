import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {UserForRegistration} from '../_models/user-for-registration';
import {AuthService} from '../_services/authService';
import {UserForLogin} from '../_models/user-for-login';
import {Router} from '@angular/router';
import {HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})

export class RegistrationComponent implements OnInit {
  @Output() cancelRegistration = new EventEmitter();
  model: UserForRegistration = {displayName: '', password: '', username: ''};
  private headers: string[];

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit() {
  }

  cancel() {
    this.cancelRegistration.emit();
  }

  register() {
    let createdAt: string;

    this.authService.Register(this.model).subscribe(response => {
      console.log('Success'); // TODO Alertify
      createdAt = response.headers.get('location').replace(environment.apiUrl, '').toLowerCase();
    }, error => {
      console.log('ERROR: ' + error); // TODO Error Handling
    }, () => {
      const user: UserForLogin = new class implements UserForLogin {
        password: string;
        username: string;
      };
      user.username = this.model.username;
      user.password = this.model.password;

      this.authService.login(user).subscribe(value => {
        console.log('login complete... redirecting to: ' + createdAt); // TODO Alertify
        this.router.navigate([createdAt]);
      });
    });
  }
}
