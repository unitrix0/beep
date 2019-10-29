import {Component, Input, OnInit} from '@angular/core';
import {Invitation} from '../../_models/invitation';

@Component({
  selector: 'app-invitation-card',
  templateUrl: './invitation-card.component.html',
  styleUrls: ['./invitation-card.component.css']
})
export class InvitationCardComponent implements OnInit {
  @Input() invitation: Invitation;

  constructor() {
  }

  ngOnInit() {
  }

}
