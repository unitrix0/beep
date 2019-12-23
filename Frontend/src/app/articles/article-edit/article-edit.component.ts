import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BsLocaleService, defineLocale, deLocale} from 'ngx-bootstrap';
import {ArticlesService} from '../../_services/articles.service';
import {Article} from '../../_models/article';
import {AlertifyService} from '../../_services/alertify.service';

defineLocale('de', deLocale);

@Component({
  selector: 'app-article-edit',
  templateUrl: './article-edit.component.html',
  styleUrls: ['./article-edit.component.css']
})
export class ArticleEditComponent implements OnInit {
  @Output() articleCreated = new EventEmitter<Article>();
  @Input() article: Article;

  constructor(private localeService: BsLocaleService, private articleData: ArticlesService, private alertify: AlertifyService) {
  }

  ngOnInit() {
    this.localeService.use('de');
  }

  saveArticle() {
    console.log(this.article);
    this.articleData.saveArticle(this.article)
      .subscribe(createdArticle => {
        this.alertify.success('Artikel gespeichert');
        this.articleCreated.emit(createdArticle);
      }, error => {
        this.alertify.error('Artikel konnte nicht angelegt werden: ' + error.message);
      });
  }


}
