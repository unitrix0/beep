import {Component, OnInit} from '@angular/core';
import {UserToken} from './_models/userToken';
import {AuthService} from './_services/authService';
import {JwtHelperService} from '@auth0/angular-jwt';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Frontend';
  jwtHelper = new JwtHelperService();


  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const user: UserToken = JSON.parse(localStorage.getItem('user'));

    if (token) {
      this.authService.decodedToken = this.jwtHelper.decodeToken(token);
    }

    if (user) {
      this.authService.currentUser = user;
    }
  }
}
