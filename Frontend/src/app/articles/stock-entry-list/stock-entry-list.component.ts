import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {StockEntry} from '../../_models/stock.entry';
import {Article} from '../../_models/article';
import {ArticlesService} from '../../_services/articles.service';
import {StockListColumns} from '../../_enums/stock-list-columns.enum';
import {PaginatedResult} from '../../_models/pagination';
import {PageChangedEvent} from 'ngx-bootstrap';
import {PermissionsService} from '../../_services/permissions.service';
import {PermissionFlags} from '../../_enums/permission-flags.enum';
import {PagedStockList} from '../../_models/paged-stock-list';

@Component({
  selector: 'app-stock-entry-list',
  templateUrl: './stock-entry-list.component.html',
  styleUrls: ['./stock-entry-list.component.css']
})
export class StockEntryListComponent implements OnInit {
  @Input() article: Article;
  @Input() stockData: PagedStockList;
  @Input() selectedColumns: StockListColumns[];
  @Input() rowSelect = true;
  @Output() entrySelected = new EventEmitter<number>();
  @Output() checkOutClicked = new EventEmitter<StockEntry>();
  @Output() openArticleClicked = new EventEmitter<{ mouseEvent: MouseEvent, entry: StockEntry }>();
  @Output() pageChanged = new EventEmitter<PageChangedEvent>();
  private selectedEntryId: number;
  private columns = StockListColumns;
  private scanArticlePermission = PermissionFlags.isOwner | PermissionFlags.canScan;

  constructor(private articleData: ArticlesService, private permissionsService: PermissionsService) {
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

  checkOut(entry: StockEntry) {
    if (this.permissionsService.hasPermissionOr(this.scanArticlePermission)) {
      this.checkOutClicked.emit(entry);
    }
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

