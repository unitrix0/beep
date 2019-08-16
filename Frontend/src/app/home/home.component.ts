import {Component, OnInit} from '@angular/core';
import {UserForRegistration} from '../_models/user-for-registration';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  showRegForm = false;

  constructor() {
  }

  ngOnInit() {
  }


  hideRegistrationForm() {
    this.showRegForm = false;
  }

  showRegistration() {
    this.showRegForm = true;
  }
}
