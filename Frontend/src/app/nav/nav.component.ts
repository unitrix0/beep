import {Component, OnInit, ViewChild} from '@angular/core';
import {UserForLogin} from '../_models/user-for-login';
import {AuthService} from '../_services/authService';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  user: UserForLogin = new class implements UserForLogin {
    password: string;
    username: string;
  };

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
  }

  login() {
    console.log('login');
    this.authService.login(this.user).subscribe(() => {
      console.log('Success');
    }, error => {
      console.log('ERROR: ' + error); // TODO Error Handling
    });
  }

  loggedIn(): boolean {
    return this.authService.loggedIn();
  }

  logout() {
    this.authService.logout();
  }
}
