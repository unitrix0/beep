import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {BsLocaleService, defineLocale, deLocale, TabDirective} from 'ngx-bootstrap';
import {ArticlesService} from '../../_services/articles.service';
import {Article} from '../../_models/article';
import {AlertifyService} from '../../_services/alertify.service';
import {ArticleStockComponent} from '../article-stock/article-stock.component';
import {AuthService} from '../../_services/auth.service';

defineLocale('de', deLocale);

@Component({
  selector: 'app-article-edit',
  templateUrl: './article-edit.component.html',
  styleUrls: ['./article-edit.component.css']
})
export class ArticleEditComponent implements OnInit {
  @Output() articleCreated = new EventEmitter<Article>();
  @Input() article: Article;
  @ViewChild(ArticleStockComponent) stockComponent: ArticleStockComponent;

  constructor(private localeService: BsLocaleService, private articleData: ArticlesService,
              private alertify: AlertifyService, private auth: AuthService) {
  }

  ngOnInit() {
    this.localeService.use('de');
  }

  saveArticle() {
    this.articleData.saveArticle(this.article)
      .subscribe(createdArticle => {
        this.alertify.success('Artikel gespeichert');
        this.articleCreated.emit(createdArticle);
      }, error => {
        this.alertify.error('Artikel konnte nicht angelegt werden: ' + error.message);
      });
  }

  onSelectTab(tab: TabDirective) {
    if (tab.id === '3') {
      this.stockComponent.loadData(1);
    }
  }
}
