import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Article} from '../../_models/article';
import {AlertifyService} from '../../_services/alertify.service';
import {ArticleEditComponent} from '../article-edit/article-edit.component';
import {ArticlesService} from '../../_services/articles.service';

@Component({
  selector: 'app-article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.css']
})
export class ArticleCardComponent implements OnInit {
  @Input() article: Article;
  @ViewChild(ArticleEditComponent) editForm: ArticleEditComponent;

  private edit = false;
  private articleBackup: string;

  constructor(private alertify: AlertifyService, private articleData: ArticlesService) {
  }

  ngOnInit() {
  }

  editArticleSettings() {
    if (!this.edit) {
      this.articleBackup = JSON.stringify(this.article);
      this.edit = true;
      return;
    }

    if (this.editForm.modified) {
      this.alertify.confirm('Änderungen verwerfen?', () => {
        this.edit = false;
        this.article = JSON.parse(this.articleBackup);
      });
    } else {
      this.edit = false;
    }
  }

  updateArticle() {
    this.articleData.updateArticle(this.article)
      .subscribe(value => {
        this.alertify.success('Änderungen gespeichert');
        this.editForm.saved = true;
      }, error => {
        this.alertify.error('Änderungen konnten nicht gespeichert werden: ' + error.message);
        this.editForm.saved = false;
      });
  }
}
