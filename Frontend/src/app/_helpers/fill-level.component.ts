import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-fill-level',
  template: `
    <progressbar [max]="1" [value]="currentValue" [type]="barType">
      <span>{{maxContent * currentValue}} {{unitAbbreviation}}</span>
    </progressbar>
  `,
  styles: [``]
})
export class FillLevelComponent implements OnInit, OnChanges {

  /**
   * Aktueller Füllstand
   */
  @Input() currentValue: number;
  /**
   * Maximaler inhalt des Artikels. Z.B.: 4 (Stk.)
   */
  @Input() maxContent: number;
  /**
   * Abkürzung der Artikel einheit z.B.: Stk.
   */
  @Input() unitAbbreviation: string;

  private barType: string;

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.barType = this.currentValue === 1 ? 'success' : 'warning';
  }

}
