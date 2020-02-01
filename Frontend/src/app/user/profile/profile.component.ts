import {Component, Input, OnInit} from '@angular/core';
import {User} from '../../_models/user';
import {NgModel} from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @Input() user: User;
  password: string;
  confirmPassword: string;

  constructor() {
  }

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
