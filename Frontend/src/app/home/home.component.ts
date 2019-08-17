import {Component, OnInit} from '@angular/core';
import {UserForRegistration} from '../_models/user-for-registration';
import {AuthService} from '../_services/authService';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  showRegForm = false;

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit() {
    if (this.authService.loggedIn()) {
      this.router.navigate(['scan']);
    }
  }


  hideRegistrationForm() {
    this.showRegForm = false;
  }

  showRegistration() {
    this.showRegForm = true;
  }
}
