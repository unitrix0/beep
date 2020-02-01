import {Directive, Input} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator} from '@angular/forms';

@Directive({
  selector: '[appMinimumValue]',
  providers: [{provide: NG_VALIDATORS, useExisting: MinimumValueDirective, multi: true}]
})
export class MinimumValueDirective implements Validator {
  @Input('appMinimumValue') minimumValue: number;

  constructor() {
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return Number(control.value) < this.minimumValue ? {'minimumValue': {value: control.value}} : null;
  }
}
