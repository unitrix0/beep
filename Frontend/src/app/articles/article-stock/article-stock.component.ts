import {Component, Input, OnInit} from '@angular/core';
import {StockEntry} from '../../_models/stock.entry';
import {ArticlesService} from '../../_services/articles.service';
import {AlertifyService} from '../../_services/alertify.service';
import {PaginatedResult} from '../../_models/pagination';
import {BsModalService, PageChangedEvent} from 'ngx-bootstrap';
import {Article} from '../../_models/article';
import {CheckOutDialogComponent} from '../check-out-dialog/check-out-dialog.component';
import {ArticleOpenDialogComponent} from '../article-open-dialog/article-open-dialog.component';
import {ArticleUserSettings} from '../../_models/articleUserSettings';
import {StockListColumns} from '../../_enums/stock-list-columns.enum';


@Component({
  selector: 'app-article-stock',
  templateUrl: './article-stock.component.html',
  styleUrls: ['./article-stock.component.css']
})
export class ArticleStockComponent implements OnInit {
  @Input() article: Article;
  @Input() articleUserSettings: ArticleUserSettings;
  stockData: PaginatedResult<StockEntry[]>;
  withDateColumn = [StockListColumns.all];
  noDateColumn = [StockListColumns.amount, StockListColumns.fillLevel, StockListColumns.isOpened, StockListColumns.checkOut];

  constructor(private articleData: ArticlesService, private alertify: AlertifyService, private modService: BsModalService) {
  }

  ngOnInit() {
    this.loadStock(1);
  }

  pageChanged(args: PageChangedEvent) {
    this.loadStock(args.page);
  }

  openArticle(args: { mouseEvent: MouseEvent; entry: StockEntry }) {
    const modalRef = this.modService.show(ArticleOpenDialogComponent,
      {
        ignoreBackdropClick: true,
        initialState: {remaining: args.entry.amountRemaining}
      });

    modalRef.content.okClicked.subscribe(newRemaining => {
      const entryCpy: StockEntry = Object.assign({}, args.entry);
      if (!entryCpy.isOpened) {
        entryCpy.openedOn = new Date().today();
      }
      entryCpy.isOpened = true;
      entryCpy.clientTimezoneOffset = new Date().getTimezoneOffset() * -1;
      entryCpy.amountRemaining = newRemaining;
      this.articleData.openArticle(entryCpy)
        .subscribe(value => {
          modalRef.hide();
          this.alertify.success('Geöffnet');
          this.applyOpenArticle(args.entry, newRemaining);
          return;
        }, error => {
          this.alertify.error('Vorgang konnte nicht abgeschlossen werden: ' + error);
        });
    });

    args.mouseEvent.preventDefault();
  }

  checkOut(entry: StockEntry) {
    const modalRef = this.modService.show(CheckOutDialogComponent, {
      ignoreBackdropClick: true,
      initialState: {totalAmount: entry.amountOnStock}
    });

    modalRef.content.okClicked.subscribe((amount: number) => {
      this.articleData.checkOutById(entry.id, amount)
        .subscribe(value => {
          modalRef.hide();
          this.alertify.success('Artikel ausgebucht');
          this.applyCheckOut(entry.id, amount);
          this.article.totalStockAmount -= amount;
        }, error => {
          this.alertify.error('Artikel konnte nicht ausgebucht werden: ' + error);
        });
    });
  }

  private loadStock(page: number) {
    this.articleData.getArticleStock(this.article.id, this.articleUserSettings.environmentId, page)
      .subscribe(result => {
        this.stockData = result;
      }, error => {
        this.alertify.error(error);
      });
  }

  private applyCheckOut(entryId: number, amount: number) {
    const entry = this.stockData.content.find(e => e.id === entryId);

    if (entry.amountOnStock === 1 || entry.amountOnStock === amount) {
      this.stockData.content.splice(this.stockData.content.findIndex(e => e.id === entryId), 1);
    } else {
      entry.amountOnStock -= amount;
    }
  }

  private applyOpenArticle(entry: StockEntry, newRemaining: number) {
    if (entry.amountOnStock === 1) {
      entry.openedOn = new Date().today();
      entry.isOpened = true;
      entry.amountRemaining = newRemaining;
      return;
    }

    const newEntry: StockEntry = Object.assign({}, entry);
    newEntry.amountRemaining = newRemaining;
    newEntry.isOpened = true;
    newEntry.openedOn = new Date().today();
    newEntry.amountOnStock = 1;

    entry.amountOnStock--;

    this.stockData.content.unshift(newEntry);
  }
}
