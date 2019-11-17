import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  changeDisplayName() {
    console.log('changeDisplayName');
  }

  changeEmail() {
    console.log('changeEmail');
  }

  changePassword() {
    console.log('changePassword');
  }
}
