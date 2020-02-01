import {Directive, Input} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn} from '@angular/forms';

@Directive({
  selector: '[appMaximumValue]',
  providers: [{provide: NG_VALIDATORS, useExisting: MaximumValueDirective, multi: true}]
})
export class MaximumValueDirective implements Validator {
  @Input('appMaximumValue') maximumValue: number;

  constructor() {
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return Number(control.value) > this.maximumValue ? {'maximumValue': {value: control.value}} : null;
  }
}
