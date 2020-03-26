import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {StockEntry} from '../../_models/stock.entry';
import {Article} from '../../_models/article';
import {ArticlesService} from '../../_services/articles.service';
import {AlertifyService} from '../../_services/alertify.service';
import {StockListColumns} from '../../_enums/stock-list-columns.enum';
import {PagedStockList} from '../../_models/paged-stock-list';
import {ArticleUserSettings} from '../../_models/articleUserSettings';
import {PageChangedEvent} from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-article-check-out',
  templateUrl: './article-check-out.component.html',
  styleUrls: ['./article-check-out.component.css']
})
export class ArticleCheckOutComponent implements OnInit {
  /** Definiert ob die Komponente für den "Geöffnet" modus verwendet wird */
  @Input() forOpenMode: boolean;
  @Input() article: Article;
  @Input() articleUserSettings: ArticleUserSettings;
  @Output() doneOrCanceled = new EventEmitter();
  selectedEntryId: number;
  showArticleOpen: boolean;
  actionButtonLabel: string;
  private actionLabel: string;
  private showCols = [StockListColumns.amount, StockListColumns.expireDate, StockListColumns.fillLevel];
  private stockData: PagedStockList;
  private selectedEntry: StockEntry;

  constructor(private articleData: ArticlesService, private alertify: AlertifyService) {
  }

  ngOnInit() {
    this.LoadData(1);
    this.actionLabel = this.forOpenMode ? 'geöffnet oder verbraucht wurde' : 'ausgebucht werden soll';
    this.actionButtonLabel = this.forOpenMode ? 'Wählen' : 'Ausbuchen';
  }

  pageChanged(args: PageChangedEvent) {
    this.LoadData(args.page);
  }

  action() {
    if (this.forOpenMode && !this.showArticleOpen) {
      this.selectedEntry = this.stockData.content.find(e => e.id === this.selectedEntryId);
      this.showArticleOpen = true;
    } else if (this.forOpenMode && this.showArticleOpen) {
      this.openArticle();
    } else {
      this.checkOut();
    }
  }

  private openArticle() {
    if (!this.selectedEntry.isOpened) {
      this.selectedEntry.openedOn = new Date().today();
    }
    this.selectedEntry.isOpened = true;
    this.selectedEntry.clientTimezoneOffset = new Date().getTimezoneOffset() * -1;
    this.articleData.openArticle(this.selectedEntry)
      .subscribe(() => {
        this.alertify.success('Geöffnet');
        this.doneOrCanceled.emit();
      }, error => {
        this.alertify.error('Vorgang fehlgeschlagen: ' + error);
      });
  }

  private checkOut() {
    this.articleData.checkOutById(this.selectedEntryId, 1)
      .subscribe(value => {
        this.alertify.success('Artikel Ausgebucht');
        this.doneOrCanceled.emit();
      }, error => {
        this.alertify.error('Ausbuchen fehlgeschlagen: ' + error);
      });
  }

  private LoadData(pageNumber: number) {
    this.articleData.getArticleStock(this.article.id, this.articleUserSettings.environmentId, pageNumber)
      .subscribe((result: PagedStockList) => {
        this.stockData = result;
      });
  }
}
