import {Component, OnInit} from '@angular/core';
import {User} from '../_models/user';
import {BeepEnvironment} from '../_models/beep-environment';
import {ActivatedRoute} from '@angular/router';
import {Permission} from '../_models/permission';
import {DataService} from '../_services/data.service';
import {AlertifyService} from '../_services/alertify.service';

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

  constructor(private route: ActivatedRoute, private data: DataService, private alertify: AlertifyService) {
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
        this.alertify.success('Success');
      }, error => {
        this.alertify.error('ERROR: ' + error); // TODO Error handling
      });
  }

  addEnvironment() {
    this.data.addEnvironment(this.user.id)
      .subscribe((newEnv: BeepEnvironment) => {
        this.environments.push(newEnv);
      }, error => {
        // TODO Error Handling
        this.alertify.error('ERROR: ' + error);
      });
  }

  deleteEnvironment() {
    this.alertify.confirm('Soll die Umgebung "' + this.currentEnvironment.name + '" wirklich gelöscht werden?', () => {
      this.data.deleteEnvironment(this.user.id, this.currentEnvironment.id)
        .subscribe(value => {
          this.environments.splice(this.environments.indexOf(this.currentEnvironment), 1);
          this.alertify.success('Success');
        }, error => {
          this.alertify.error('Umgebung konnt enicht gelöscht werden!'); // TODO Error handling
          console.log(error);
        });
    });
  }
}
