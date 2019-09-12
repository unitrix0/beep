import {Component, OnInit} from '@angular/core';
import {User} from '../_models/user';
import {BeepEnvironment} from '../_models/beep-environment';
import {ActivatedRoute} from '@angular/router';
import {Permission} from '../_models/permission';
import {DataService} from '../_services/data.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  user: User;
  environments: BeepEnvironment[];
  currentEnvironment: BeepEnvironment;
  currentMember: Permission;

  constructor(private route: ActivatedRoute, private data: DataService) {
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data['user'];
      this.environments = this.user.environments;
    });
  }

  selectEnvironment(environmentIdx: number) {
    this.currentEnvironment = this.environments[environmentIdx];
    this.currentMember = this.currentEnvironment.permissions[0];
  }

  selectUser(userIdx: number) {
    this.currentMember = this.currentEnvironment.permissions[userIdx];
  }

  savePermissions() {
    this.data.updateUserPermissions(this.currentEnvironment.id, this.currentMember)
      .subscribe(value => {
        console.log('Success'); // TODO Alertify
      }, error => {
        console.log('ERROR: ' + error); // TODO Error handling
      });
  }

  addEnvironment() {
    this.data.addEnvironment(this.user.id)
      .subscribe(newEnv => {
        console.log('Success: ' + newEnv);
        this.updateEnvironmentList();
      }, error => {
        // TODO Error Handling
        console.log('ERROR: ' + error);
      });
  }

  updateEnvironmentList() {
    this.data.getEnvironments(this.user.id).subscribe(value => {
        this.environments = value;
      },
      error => {
        // TODO Error Handling
        console.log('ERROR: ' + error);
      });
  }
}
