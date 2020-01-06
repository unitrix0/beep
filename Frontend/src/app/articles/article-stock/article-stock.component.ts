import {Component, Input, OnInit} from '@angular/core';
import {StockEntry} from '../../_models/stock.entry';
import {ArticlesService} from '../../_services/articles.service';
import {AlertifyService} from '../../_services/alertify.service';
import {Pagination} from '../../_models/pagination';
import {PageChangedEvent} from 'ngx-bootstrap';
import {Article} from '../../_models/article';


@Component({
  selector: 'app-article-stock',
  templateUrl: './article-stock.component.html',
  styleUrls: ['./article-stock.component.css']
})
export class ArticleStockComponent implements OnInit {
  @Input() article: Article;

  private pagination: Pagination;
  private entries: StockEntry[];

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
}
