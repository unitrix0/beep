import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AuthService} from '../_services/auth.service';
import {BeepEnvironment} from '../_models/beep-environment';
import {AlertifyService} from '../_services/alertify.service';
import {UsersService} from '../_services/users.service';
import {PermissionsService} from '../_services/permissions.service';

@Component({
  selector: 'app-environment-selector',
  templateUrl: './environment-selector.component.html',
  styleUrls: ['./environment-selector.component.css']
})
export class EnvironmentSelectorComponent implements OnInit {
  @Input() small = true;
  @Output() environmentChanged = new EventEmitter();

  private environments: BeepEnvironment[];
  private activeEnvironment: string;

  constructor(private usersService: UsersService, private permissions: PermissionsService, private alertify: AlertifyService) {
  }

  ngOnInit() {
    this.usersService.getEnvironments(this.permissions.token.userId)
      .subscribe(value => {
        this.environments = value;
        this.activeEnvironment = this.environments.find(e => e.id === this.permissions.token.environment_id)
          .name;
      }, error => {
        this.alertify.error('Liste der Umgebungen konnte nicht abgefragt werden: ' + error);
      });
  }

  changeEnvironment(newEnvironmentId: number) {
    this.permissions.updatePermissionClaims(newEnvironmentId)
      .subscribe(value => {
        this.activeEnvironment = this.environments.find(e => e.id === newEnvironmentId).name;
        this.environmentChanged.emit();
      }, error => {
        this.alertify.error('Die Umgebung konnte nicht gewechselt werden: ' + error.mesage);
      });
  }
}
