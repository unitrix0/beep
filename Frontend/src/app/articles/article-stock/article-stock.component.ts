import {Component, Input, OnInit} from '@angular/core';
import {StockEntry} from '../../_models/stock.entry';
import {ArticlesService} from '../../_services/articles.service';
import {AlertifyService} from '../../_services/alertify.service';
import {Pagination} from '../../_models/pagination';
import {PageChangedEvent} from 'ngx-bootstrap';


@Component({
  selector: 'app-article-stock',
  templateUrl: './article-stock.component.html',
  styleUrls: ['./article-stock.component.css']
})
export class ArticleStockComponent implements OnInit {
  @Input() articleId: number;
  @Input() environmentId: number;

  private pagination: Pagination;
  private entries: StockEntry[];
  private totalAmount: number;

  constructor(private articleData: ArticlesService, private alertify: AlertifyService) {
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
    console.log('Loading Data...');
    this.articleData.getArticleStock(this.articleId, this.environmentId, page)
      .subscribe(result => {
        this.entries = result.content;
        this.pagination = result.pagination;
        this.totalAmount = this.entries
          .map(e => e.amountOnStock)
          .reduce((sum, current) => sum + current);
      }, error => {
        this.alertify.error(error.message);
      });
  }

  pageChanged(args: PageChangedEvent) {
    this.loadData(args.page);
  }
}
