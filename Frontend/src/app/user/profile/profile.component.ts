import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {User} from '../../_models/user';
import {UsersService} from '../../_services/users.service';
import {AlertifyService} from '../../_services/alertify.service';
import {NgForm} from '@angular/forms';
import {AuthService} from '../../_services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @Input() user: User;
  @ViewChild('displayName', { static: true }) displayName: NgForm;
  @ViewChild('changeMail', { static: true }) changeMail: NgForm;
  @ViewChild('changePw', { static: true }) changePw: NgForm;
  newPassword: string;
  confirmPassword: string;
  currentPassword: any;

  constructor(private userService: UsersService, private alertify: AlertifyService, public authService: AuthService) {
  }

  ngOnInit() {
  }

  changeDisplayName() {
    this.userService.changeDisplayName(this.user.id, this.user.displayName)
      .subscribe(() => {
        this.alertify.success('Änderung gespeichert');
        this.authService.updateDisplayName(this.user.displayName);
      }, error => {
        this.alertify.error('Änderungen konnten nicht gespeichert werden: ' + error);
      });
  }

  changeEmail() {
    this.userService.changeEmailAddress(this.user.id, this.user.email)
      .subscribe(() => {
        this.alertify.error('Es wurde eine E-Mail mit einem Link zur bestätigung gesendet. ' +
          'Die Adresse wird nacht der bestätigung geändert.');
        this.changeMail.resetForm();
      }, error => {
        this.alertify.error('Änderungen konnten nicht gespeichert werden: ' + error);
      });
  }

  changePassword() {
    this.userService.changePassword(this.user.id, this.currentPassword, this.newPassword)
      .subscribe(() => {
        this.alertify.success('Änderung gespeichert');
        this.changePw.resetForm();
      }, error => {
        this.alertify.error('Änderungen konnten nicht gespeichert werden: ' + error);
      });
  }

  resendConfirmation() {
    this.authService.resendEmailConfirmation(this.user.username)
      .subscribe(value => {
        this.alertify.success('Nachricht gesendet');
      }, error => {
        this.alertify.error('Nachricht konnte nicht gesendet werden: ' + error.mssage);
      });
  }
}
