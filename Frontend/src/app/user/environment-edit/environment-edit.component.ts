import {Component, Input, OnInit} from '@angular/core';
import {BeepEnvironment} from '../../_models/beep-environment';
import {MemberPermission} from '../../_models/memberPermission';
import {InviteDialogComponent} from '../invite-dialog/invite-dialog.component';
import {SendInvitationEventArgs} from '../../_models/send-invitation-event.args';
import {UsersService} from '../../_services/users.service';
import {AlertifyService} from '../../_services/alertify.service';
import {PermissionsService} from '../../_services/permissions.service';
import {BsModalService} from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-environment-edit',
  templateUrl: './environment-edit.component.html',
  styleUrls: ['./environment-edit.component.css']
})
export class EnvironmentEditComponent implements OnInit {
  @Input() environments: BeepEnvironment[];
  @Input() userId: number;
  members: MemberPermission[];
  currentEnvironment: BeepEnvironment;
  currentMember: MemberPermission;

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
        this.alertify.error('Berechtigungen konnten nicht abgefragt werden: ' + error);
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
    const modalRef = this.modalSvc.show(InviteDialogComponent);
    modalRef.content.SendInvitation.subscribe((eventArgs: SendInvitationEventArgs) => {
      this.data.inviteMember(eventArgs.recipient, this.currentEnvironment.id, eventArgs.isMail)
        .subscribe(value => {
          modalRef.hide();
          this.alertify.success('Einladung verschickt');
        }, error => {
          this.alertify.error('Die Einladung konnte nicht verschickt werden: ' + error);
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
        this.alertify.error('Der Benutzer konnte nicht entfernt werden: ' + error);
      });
  }

  onlyOneEnvironment() {
    return this.environments.filter(e => e.ownerId === this.userId).length === 1;
  }

  updateEnvName(newName: string) {
    this.data.updateEnvironmentName(this.currentEnvironment.id, newName)
      .subscribe(() => {
        this.currentEnvironment.name = newName;
        this.alertify.success('Name gespeichert');
      }, error => {
        this.alertify.error('Der Name konnte nicht angepasst werden: ' + error);
      });
  }
}
