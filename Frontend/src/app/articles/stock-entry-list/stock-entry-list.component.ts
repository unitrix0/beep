import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {StockEntry} from '../../_models/stock.entry';
import {Article} from '../../_models/article';
import {ArticlesService} from '../../_services/articles.service';
import {StockListColumns} from '../../_enums/stock-list-columns.enum';
import {PaginatedResult} from '../../_models/pagination';
import {PageChangedEvent} from 'ngx-bootstrap';

@Component({
  selector: 'app-stock-entry-list',
  templateUrl: './stock-entry-list.component.html',
  styleUrls: ['./stock-entry-list.component.css']
})
export class StockEntryListComponent implements OnInit {
  @Input() article: Article;
  @Input() stockData: PaginatedResult<StockEntry[]>;
  @Input() selectedColumns: StockListColumns[];
  @Output() entrySelected = new EventEmitter<number>();
  @Output() checkOutClicked = new EventEmitter<StockEntry>();
  @Output() pageChanged = new EventEmitter<PageChangedEvent>();
  private selectedEntryId: number;
  private columns = StockListColumns;

  constructor(private articleData: ArticlesService) {
  }

  ngOnInit() {
  }

  selectEntry(id: number) {
    this.selectedEntryId = id;
    this.entrySelected.emit(id);
  }


  private showColumn(column: StockListColumns): boolean {
    if (!this.selectedColumns) {
      return true;
    }
    let selectedCols = StockListColumns.all;
    this.selectedColumns.forEach(f => selectedCols |= f);

    return selectedCols === 0 ? true : (selectedCols & column) !== 0;
  }
}

