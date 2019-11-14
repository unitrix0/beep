import {Component, OnInit, ViewChild} from '@angular/core';
import {UserForLogin} from '../_models/user-for-login';
import {Router} from '@angular/router';
import {AlertifyService} from '../_services/alertify.service';
import {DataService} from '../_services/data.service';
import {AuthService} from '../_services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {
  user: UserForLogin = new class implements UserForLogin {
    password: string;
    username: string;
  };
  invitationsCount: any;

  constructor(private authService: AuthService, private router: Router, private alertify: AlertifyService, private data: DataService) {
    this.data.invitationsCountUpdated.subscribe(count => {
      this.invitationsCount = count;
    });
  }

  login() {
    this.authService.login(this.user).subscribe(() => {
      this.alertify.success('Anmeldung erfolgreich');
      this.router.navigate(['scan']);
    }, error => {
      this.alertify.error('Anmeldung fehlgeschlagen. Benutzname oder Passwort falsch');
      // TODO Error Handling
      console.log(error);
    });
  }

  loggedIn(): boolean {
    return this.authService.loggedIn();
  }

  logout() {
    this.authService.logout();
  }
}
