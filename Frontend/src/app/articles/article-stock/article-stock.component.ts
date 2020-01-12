import {Component, Input, OnInit} from '@angular/core';
import {StockEntry} from '../../_models/stock.entry';
import {ArticlesService} from '../../_services/articles.service';
import {AlertifyService} from '../../_services/alertify.service';
import {Pagination} from '../../_models/pagination';
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

  private pagination: Pagination;
  private entries: StockEntry[];

  constructor(private articleData: ArticlesService, private alertify: AlertifyService, private modalService: BsModalService) {
  }

  ngOnInit() {
    this.pagination = new class implements Pagination {
      currentPage: number;
      itemsPerPage: number;
      totalItems: number;
      totalPages: number;
    };
  }

  public loadData(page: number) {
    this.articleData.getArticleStock(this.article.id, this.article.articleUserSettings.environmentId, page)
      .subscribe(result => {
        this.entries = result.content;
        this.pagination = result.pagination;
      }, error => {
        this.alertify.error(error.message);
      });
  }

  pageChanged(args: PageChangedEvent) {
    this.loadData(args.page);
  }

  checkOut(entryId: number, entryAmount: number) {
    const modalRef = this.modalService.show(CheckOutDialogComponent, {ignoreBackdropClick: true, initialState: {totalAmount: entryAmount}});
    modalRef.content.okClicked.subscribe((amount: number) => {
      this.articleData.checkOutById(entryId, amount)
        .subscribe(value => {
          modalRef.hide();
          this.alertify.success('Artikel ausgebucht');
          this.cleanupArray(entryId, amount);
          this.article.totalStockAmount -= amount;
        }, error => {
          this.alertify.error('Artikel konnte nicht ausgebucht werden: ' + error.message);
        });
    });

  }

  private cleanupArray(entryId: number, amount: number) {
    const entry = this.entries.find(e => e.id === entryId);

    if (entry.amountOnStock === 1 || entry.amountOnStock === amount) {
      this.entries.splice(this.entries.findIndex(e => e.id === entryId), 1);
    } else {
      entry.amountOnStock -= amount;
    }
  }
}
