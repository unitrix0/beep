import {Component, OnInit} from '@angular/core';
import {Invitation} from '../_models/invitation';
import {ActivatedRoute} from '@angular/router';
import {DataService} from '../_services/data.service';
import {AuthService} from '../_services/authService';
import {AlertifyService} from '../_services/alertify.service';

@Component({
  selector: 'app-invitations',
  templateUrl: './invitations.component.html',
  styleUrls: ['./invitations.component.css']
})
export class InvitationsComponent implements OnInit {
  invitations: Invitation[];

  constructor(private route: ActivatedRoute, private data: DataService, private authService: AuthService, private alertify: AlertifyService) {
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.invitations = data['invitations'];
    });
  }

  answerInvitation(idx: number, answer: number) {
    const invitation = this.invitations[idx];
    this.data.answerInvitation(this.authService.decodedToken.nameid, invitation.environmentId, answer)
      .subscribe(value => {
        this.alertify.success('Einladung beantwortet');
        this.invitations.splice(idx, 1);
      }, error => {
        this.alertify.error('Einladung konnte nicht beantwortet werden: ' + error.message);
        console.log(error);
      });
  }
}
