import {Component, Input, OnInit} from '@angular/core';
import {BeepEnvironment} from '../../_models/beep-environment';
import {Permission} from '../../_models/permission';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {InviteDialogComponent} from '../invite-dialog/invite-dialog.component';
import {SendInvitationEventArgs} from '../../_models/send-invitation-event.args';
import {UsersService} from '../../_services/users.service';
import {AlertifyService} from '../../_services/alertify.service';
import {PermissionsService} from '../../_services/permissions.service';

@Component({
  selector: 'app-environment-edit',
  templateUrl: './environment-edit.component.html',
  styleUrls: ['./environment-edit.component.css']
})
export class EnvironmentEditComponent implements OnInit {
  @Input() environments: BeepEnvironment[];
  @Input() userId: number;
  members: Permission[];
  currentEnvironment: BeepEnvironment;
  currentMember: Permission;
  modalRef: BsModalRef;

  constructor(private data: UsersService, private alertify: AlertifyService, private modalSvc: BsModalService,
              private permissions: PermissionsService) {
  }

  ngOnInit() {
  }

  selectEnvironment(environmentIdx: number) {
    this.currentEnvironment = this.environments[environmentIdx];
    this.data.getEnvironmentPermissions(this.currentEnvironment.id, this.userId)
      .subscribe(value => {
        this.members = value;
      }, error => {
        this.alertify.error('Berechtigungen konnten nicht abgefragt werden: ' + error.message);
      });
  }

  selectUser(userIdx: number) {
    this.currentMember = this.members[userIdx];
  }

  savePermissions() {
    this.data.setPermission(this.currentEnvironment.id, this.currentMember)
      .subscribe(value => {
        this.alertify.success('Success');
      }, error => {
        this.alertify.error('ERROR: ' + error); // TODO Error handling
      });
  }

  addEnvironment() {
    this.data.addEnvironment(this.userId)
      .subscribe((newEnv: BeepEnvironment) => {
        this.environments.push(newEnv);
      }, error => {
        // TODO Error Handling
        this.alertify.error('ERROR: ' + error);
      });
  }

  deleteEnvironment() {
    this.alertify.confirm('Soll die Umgebung "' + this.currentEnvironment.name + '" wirklich gelöscht werden?', () => {
      this.data.deleteEnvironment(this.userId, this.currentEnvironment.id)
        .subscribe(value => {
          this.environments.splice(this.environments.indexOf(this.currentEnvironment), 1);
          this.alertify.success('Gelöscht!');
        }, error => {
          this.alertify.error('Umgebung konnte nicht gelöscht werden!'); // TODO Error handling
          console.log(error);
        });
    });
  }

  openInviteDialog() {
    this.modalRef = this.modalSvc.show(InviteDialogComponent);
    this.modalRef.content.SendInvitation.subscribe((eventArgs: SendInvitationEventArgs) => {
      this.modalRef.hide();

      this.data.inviteMember(eventArgs.recipient, this.currentEnvironment.id, eventArgs.isMail)
        .subscribe(value => {
          this.alertify.success('Einladung verschickt');
        }, error => {
          this.alertify.error('Die Einladung konnte nicht verschickt werden: ' + error.message);
        });
    });
  }

  removeMember() {
    this.data.removeMember(this.userId, this.currentEnvironment.id, this.currentMember.userId)
      .subscribe(value => {
        this.members.splice(
          this.members.indexOf(this.currentMember), 1);

        this.alertify.success('Benutzer entfernt');
      }, error => {
        this.alertify.error('Der Benutzer konnte nicht entfernt werden: ' + error.message);
      });
  }
}
