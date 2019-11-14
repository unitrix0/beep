import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';
import {SendInvitationEventArgs} from '../../_models/send-invitation-event.args';
import {getInitialClassNameValue} from '@angular/core/src/render3/styling/class_and_style_bindings';
import {EmailValidator} from '@angular/forms';

@Component({
  selector: 'app-invite-dialog',
  templateUrl: './invite-dialog.component.html',
  styleUrls: ['./invite-dialog.component.css']
})
export class InviteDialogComponent implements OnInit {
  @Output() SendInvitation = new EventEmitter<SendInvitationEventArgs>();
  @ViewChild('invitationForm') form;

  recipient: string;

  constructor(private modalRef: BsModalRef) {
  }

  ngOnInit() {
  }

  send() {
    const args: SendInvitationEventArgs = new class implements SendInvitationEventArgs {
      isMail: boolean;
      recipient: string;
    };

    const validator = new EmailValidator();
    validator.email = true;

    args.isMail = validator.validate(this.form.controls.recipient) == null;
    args.recipient = this.recipient;

    console.log(args);
    this.SendInvitation.emit(args);
  }
}