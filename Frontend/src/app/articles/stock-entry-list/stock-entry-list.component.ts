import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {StockEntry} from '../../_models/stock.entry';
import {Article} from '../../_models/article';
import {ArticlesService} from '../../_services/articles.service';
import {StockListColumns} from '../../_enums/stock-list-columns.enum';
import {PaginatedResult} from '../../_models/pagination';
import {BsModalService, PageChangedEvent} from 'ngx-bootstrap';
import {AlertifyService} from '../../_services/alertify.service';

@Component({
  selector: 'app-stock-entry-list',
  templateUrl: './stock-entry-list.component.html',
  styleUrls: ['./stock-entry-list.component.css']
})
export class StockEntryListComponent implements OnInit {
  @Input() article: Article;
  @Input() stockData: PaginatedResult<StockEntry[]>;
  @Input() selectedColumns: StockListColumns[];
  @Input() rowSelect = true;
  @Output() entrySelected = new EventEmitter<number>();
  @Output() checkOutClicked = new EventEmitter<StockEntry>();
  @Output() openArticleClicked = new EventEmitter<{ mouseEvent: MouseEvent, entry: StockEntry }>();
  @Output() pageChanged = new EventEmitter<PageChangedEvent>();
  private selectedEntryId: number;
  private columns = StockListColumns;

  constructor(private articleData: ArticlesService) {
  }

  ngOnInit() {
  }

  selectEntry(id: number) {
    if (this.rowSelect) {
      this.selectedEntryId = id;
      this.entrySelected.emit(id);
    }
  }

  openArticle(args: MouseEvent) {
    const entryId = parseInt((args.target as Element).id.substr(7), 10);
    const stockEntry = this.stockData.content.find(e => e.id === entryId);

    this.openArticleClicked.emit({mouseEvent: args, entry: stockEntry});
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

