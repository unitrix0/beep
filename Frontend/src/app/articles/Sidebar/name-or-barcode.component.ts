import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component(
  {
    selector: 'app-name-or-barcode',
    templateUrl: './name-or-barcode.component.html',
    styles: []
  })

export class NameOrBarcodeComponent {
  @Input() nameOrEan: string;
  @Output() nameOrEanChange = new EventEmitter();

}
