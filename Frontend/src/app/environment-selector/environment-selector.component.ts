import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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
  activeEnvironmentId: string;
  activeEnvironmentName: string;
  environments: BeepEnvironment[];

  constructor(private usersService: UsersService, private permissions: PermissionsService, private alertify: AlertifyService) {
  }

  ngOnInit() {
    this.usersService.getEnvironments(this.permissions.token.userId)
      .subscribe(value => {
        this.environments = value;
        this.activeEnvironmentId = String(this.permissions.token.environment_id);
        this.activeEnvironmentName = this.environments.find( e => e.id.toString() === this.activeEnvironmentId).name;
      }, error => {
        this.alertify.error('Liste der Umgebungen konnte nicht abgefragt werden: ' + error);
      });
  }

  changeEnvironment() {
    this.permissions.updatePermissionClaims(this.activeEnvironmentId)
      .subscribe(value => {
        this.activeEnvironmentName = this.environments.find(e => e.id.toString() === this.activeEnvironmentId).name;
        this.environmentChanged.emit();
      }, error => {
        this.alertify.error('Die Umgebung konnte nicht gewechselt werden: ' + error.mesage);
      });
  }
}
