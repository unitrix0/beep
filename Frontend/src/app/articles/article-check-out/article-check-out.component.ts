import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {StockEntry} from '../../_models/stock.entry';
import {PaginatedResult, Pagination} from '../../_models/pagination';
import {Article} from '../../_models/article';
import {PageChangedEvent} from 'ngx-bootstrap';
import {ArticlesService} from '../../_services/articles.service';
import {AlertifyService} from '../../_services/alertify.service';

@Component({
  selector: 'app-article-check-out',
  templateUrl: './article-check-out.component.html',
  styleUrls: ['./article-check-out.component.css']
})
export class ArticleCheckOutComponent implements OnInit {

  @Input() article: Article;
  @Output() doneOrCanceled = new EventEmitter();

  private stockEntries: StockEntry[];
  private pagination: Pagination;
  private selectedEntryId: number;

  constructor(private articleData: ArticlesService, private alertify: AlertifyService) {
  }

  ngOnInit() {
    this.LoadData(1);
  }

  pageChanged(eventArgs: PageChangedEvent) {
    this.LoadData(eventArgs.page);
  }

  selectEntry(id: number) {
    console.log(id);
    this.selectedEntryId = id;
  }

  checkOut() {
    this.articleData.checkOutById(this.selectedEntryId, 1)
      .subscribe(value => {
        this.alertify.success('Artikel Ausgebucht');
        this.doneOrCanceled.emit();
      }, error => {
        this.alertify.error('Ausbuchen fehlgeschlagen: ' + error.message);
      });
  }

  private LoadData(pageNumber: number) {
    this.articleData.getArticleStock(this.article.id, this.article.articleUserSettings.environmentId, pageNumber)
      .subscribe((result: PaginatedResult<StockEntry[]>) => {
        this.pagination = result.pagination;
        this.stockEntries = result.content;
      });
  }
}
