import {Component, OnInit} from '@angular/core';
import {InvitationListItem} from '../_models/invitationListItem';
import {ActivatedRoute} from '@angular/router';
import {UsersService} from '../_services/users.service';
import {AuthService} from '../_services/auth.service';
import {AlertifyService} from '../_services/alertify.service';
import {UserInvitations} from '../_models/user-invitations';

@Component({
  selector: 'app-invitations',
  templateUrl: './invitations.component.html',
  styleUrls: ['./invitations.component.css']
})
export class InvitationsComponent implements OnInit {
  invitationsReceived: InvitationListItem[];
  invitationsSent: InvitationListItem[];

  constructor(private route: ActivatedRoute, private data: UsersService, private authService: AuthService,
              private alertify: AlertifyService) {
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      const userInvitations: UserInvitations = data['invitations'];
      this.invitationsReceived = userInvitations.receivedInvitations;
      this.invitationsSent = userInvitations.sentInvitations;
    });
  }

  answerInvitation(idx: number, answer: number) {
    const invitation = this.invitationsReceived[idx];
    this.data.answerInvitation(this.authService.decodedToken.nameid, invitation.environmentId, answer)
      .subscribe(value => {
        this.alertify.success('Einladung beantwortet');
        this.invitationsReceived.splice(idx, 1);
        this.data.updateInvitationsCount(this.authService.decodedToken.nameid);
      }, error => {
        this.alertify.error('Einladung konnte nicht beantwortet werden: ' + error.message);
        console.log(error);
      });
  }

  deleteInvitation(inviteeId: number, environmentId: number) {
    this.data.deleteInvitation(this.authService.decodedToken.nameid, inviteeId, environmentId)
      .subscribe(value => {
        this.alertify.success('Einladung gelöscht');
        this.invitationsSent.splice(this.invitationsSent
          .findIndex(i => i.inviteeId === inviteeId && i.environmentId === environmentId), 1);
      }, error => {
        this.alertify.error('Einladung konnte nicht gelöscht werden: ' + error.message);
      });
  }

  deleteAnsweredInvitations() {
    this.data.deleteAnsweredInvitations(this.authService.decodedToken.nameid)
      .subscribe(value => {
        this.alertify.success('Einladungen gelöscht');
        const invitations = this.invitationsSent.filter(i => i.isAnswered === true);
        for (const invitation of invitations) {
          this.invitationsSent.splice(this.invitationsSent.indexOf(invitation), 1);
        }
      }, error => {
        this.alertify.error('Einlaungen konnten nicht gelöscht werden: ' + error.message);
      });
  }
}
