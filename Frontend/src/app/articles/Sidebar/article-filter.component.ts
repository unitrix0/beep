import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component(
  {
    selector: 'app-article-filter',
    templateUrl: './article-filter.component.html',
    styles: []
  })

export class ArticleFilterComponent {
  @Input() storeId: number;
  @Output() storeIdChange = new EventEmitter();
  @Input() keepOnStock: boolean;
  @Output() keepOnStockChange = new EventEmitter();
  @Input() isOnStock: boolean;
  @Output() isOnStockChange = new EventEmitter();
  @Input() isOpened: boolean;
  @Output() isOpenedChange = new EventEmitter();

  @Output() setFilter = new EventEmitter();
  @Output() clearFilter = new EventEmitter();

  constructor() {
  }


  emitSetFilter() {
    this.setFilter.emit();
  }
}
