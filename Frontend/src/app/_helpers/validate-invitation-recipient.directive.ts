import {Directive, forwardRef, Injectable} from '@angular/core';
import {AbstractControl, AsyncValidator, EmailValidator, NG_ASYNC_VALIDATORS, ValidationErrors} from '@angular/forms';
import {Observable} from 'rxjs';
import {AuthService} from '../_services/authService';
import {catchError, map} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
@Directive({
  selector: '[appValidateInvitationRecipient]',
  providers: [{provide: NG_ASYNC_VALIDATORS, useExisting: forwardRef(() => ValidateInvitationRecipientDirective), multi: true}]
})
export class ValidateInvitationRecipientDirective implements AsyncValidator {

  constructor(private authService: AuthService) {
  }

  validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    const result = {'notExistingUser': false, 'email': false};

    const emailValidator = new EmailValidator();
    emailValidator.email = true;
    const invalidEmail = emailValidator.validate(control) != null;

    return this.authService.userExists(control.value).pipe(
      map(value => {
        result.notExistingUser = !value;
        result.email = invalidEmail;
        return (!result.notExistingUser || !result.email) ? null : result;
      }),
      catchError(err => {
        return null;
      })
    );

  }
}
