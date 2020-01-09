import {Directive, Input} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn} from '@angular/forms';

@Directive({
  selector: '[appMinimumValue]',
  providers: [{provide: NG_VALIDATORS, useExisting: MinimumValueDirective, multi: true}]
})
export class MinimumValueDirective implements Validator {
  @Input('appMinimumValue') minimumValue: number;

  constructor() {
  }

  validate(control: AbstractControl): ValidationErrors | null {
    // return this.minimumValue ? minimumValueValidator(this.minimumValue)(control) : null;
    // console.log('validating: ' + Number(control.value) + '<' + this.minimumValue + '(' + (control.value < this.minimumValue) + ')');
    return Number(control.value) < this.minimumValue ? {'minimumValue': {value: control.value}} : null;
  }
}

export function minimumValueValidator(minimum: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    return control.value < minimum ? {'minimumValue': {value: control.value}} : null;
  };
}
