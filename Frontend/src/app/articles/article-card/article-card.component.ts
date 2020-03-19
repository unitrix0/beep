import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Article} from '../../_models/article';
import {AlertifyService} from '../../_services/alertify.service';
import {ArticleEditComponent} from '../article-edit/article-edit.component';
import {ArticlesService} from '../../_services/articles.service';
import {ArticleUserSettings} from '../../_models/articleUserSettings';

@Component({
  selector: 'app-article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.css']
})
export class ArticleCardComponent implements OnInit {
  @Input() article: Article;
  @Input() environmentId: number;
  @ViewChild(ArticleEditComponent) editForm: ArticleEditComponent;

  edit = false;
  private articleBackup: string;
  private articleUserSettings: ArticleUserSettings;

  constructor(private alertify: AlertifyService, private articleData: ArticlesService) {
  }

  ngOnInit() {
  }

  private editArticleSettings() {
    if (!this.edit) {
      this.articleData.getArticleUserSettings(this.article.id, this.environmentId)
        .subscribe(userSettings => {
          this.articleUserSettings = userSettings;
          this.articleBackup = JSON.stringify(this.article);
          this.edit = true;
        }, error => {
          this.alertify.error('Artikel details konnten nicht abgefragt werden: ' + error);
        });
    } else {
      if (this.editForm.modified) {
        this.alertify.confirm('Änderungen verwerfen?', () => {
          this.edit = false;
          this.article = JSON.parse(this.articleBackup);
        });
      } else {
        this.edit = false;
      }
    }
  }

  private updateArticle() {
    this.articleData.updateArticle(this.article, this.articleUserSettings)
      .subscribe(value => {
        this.alertify.success('Änderungen gespeichert');
        this.editForm.saved = true;
      }, error => {
        this.alertify.error('Änderungen konnten nicht gespeichert werden: ' + error);
        this.editForm.saved = false;
      });
  }
}
