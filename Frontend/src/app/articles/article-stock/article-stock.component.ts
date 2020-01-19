import {Component, Input, OnInit} from '@angular/core';
import {StockEntry} from '../../_models/stock.entry';
import {ArticlesService} from '../../_services/articles.service';
import {AlertifyService} from '../../_services/alertify.service';
import {PaginatedResult} from '../../_models/pagination';
import {BsModalService, PageChangedEvent} from 'ngx-bootstrap';
import {Article} from '../../_models/article';
import {CheckOutDialogComponent} from '../check-out-dialog/check-out-dialog.component';


@Component({
  selector: 'app-article-stock',
  templateUrl: './article-stock.component.html',
  styleUrls: ['./article-stock.component.css']
})
export class ArticleStockComponent implements OnInit {
  @Input() article: Article;
  private stockData: PaginatedResult<StockEntry[]>;

  constructor(private articleData: ArticlesService, private alertify: AlertifyService, private modalService: BsModalService) {
  }

  ngOnInit() {
    this.loadStock(1);
  }

  private checkOut(entry: StockEntry) {
    const modalRef = this.modalService.show(CheckOutDialogComponent, {
      ignoreBackdropClick: true,
      initialState: {totalAmount: entry.amountOnStock}
    });

    modalRef.content.okClicked.subscribe((amount: number) => {
      this.articleData.checkOutById(entry.id, amount)
        .subscribe(value => {
          modalRef.hide();
          this.alertify.success('Artikel ausgebucht');
          this.cleanupArray(entry.amountOnStock, amount);
          this.article.totalStockAmount -= amount;
        }, error => {
          this.alertify.error('Artikel konnte nicht ausgebucht werden: ' + error.message);
        });
    });
  }

  pageChanged(args: PageChangedEvent) {
    this.loadStock(args.page);
  }

  private loadStock(page: number) {
    this.articleData.getArticleStock(this.article.id, this.article.articleUserSettings.environmentId, page)
      .subscribe(result => {
        this.stockData = result;
      }, error => {
        this.alertify.error(error.message);
      });
  }

  private cleanupArray(entryId: number, amount: number) {
    const entry = this.stockData.content.find(e => e.id === entryId);

    if (entry.amountOnStock === 1 || entry.amountOnStock === amount) {
      this.stockData.content.splice(this.stockData.content.findIndex(e => e.id === entryId), 1);
    } else {
      entry.amountOnStock -= amount;
    }
  }
}
