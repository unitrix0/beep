import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {StockEntry} from '../_models/stock.entry';

@Component({
  selector: 'app-fill-level',
  template: `
    <div *ngIf="!entry.isOpened">ungeöffnet</div>
    <progressbar [max]="1" [value]="entry.amountRemaining" [type]="barType" *ngIf="entry.isOpened">
      <span>{{(maxContent * entry.amountOnStock * entry.amountRemaining)|round:2}} {{unitAbbreviation}}</span>
    </progressbar>
  `,
  styles: [``]
})
export class FillLevelComponent implements OnInit, OnChanges {

  /**
   * Lager eintrag mit füllstand
   */
  @Input() entry: StockEntry;
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
    this.barType = this.entry.amountRemaining === 1 ? 'success' : 'warning';
  }

}
