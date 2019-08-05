import {Component, OnInit} from '@angular/core';
import {User} from '../_models/user';
import {BeepEnvironment} from '../_models/beep-environment';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  user: User;
  currentEnvironment: BeepEnvironment;

  constructor() {
  }

  ngOnInit() {
  }

  selectEnvironment(environmentIdx: number) {
    this.currentEnvironment = this.user.environments[environmentIdx];
  }
}
