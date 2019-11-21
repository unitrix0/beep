import {Component, Input, OnInit} from '@angular/core';
import {User} from '../../_models/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @Input() user: User;

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
