import {Directive, Input} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator} from '@angular/forms';

@Directive({
  selector: '[appRequiredSelect]',
  providers: [{provide: NG_VALIDATORS, useExisting: RequiredSelectDirective, multi: true}]
})
export class RequiredSelectDirective implements Validator {
  @Input('appRequiredSelect') invalidValue: number;

  constructor() {
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return  control.value === Number(this.invalidValue) ? {'requiredSelect': {value: control.value}} : null;
  }
}
