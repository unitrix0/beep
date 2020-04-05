import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Article} from '../../_models/article';
import {AlertifyService} from '../../_services/alertify.service';
import {ArticleEditComponent} from '../article-edit/article-edit.component';
import {ArticlesService} from '../../_services/articles.service';
import {ArticleUserSettings} from '../../_models/articleUserSettings';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.css']
})
export class ArticleCardComponent implements OnInit {
  @Input() article: Article;
  @Input() environmentId: number;
  @ViewChild(ArticleEditComponent) editComponent: ArticleEditComponent;

  editMode = false;
  private articleBackup: string;
  private articleUserSettings: ArticleUserSettings;
  private modalRef: BsModalRef;

  constructor(private alertify: AlertifyService, private articleData: ArticlesService, private modalService: BsModalService) {
  }

  ngOnInit() {
  }

  showEditDialog(editDlg: TemplateRef<any>) {
    this.articleData.getArticleUserSettings(this.article.id, this.environmentId)
      .subscribe(userSettings => {
        this.articleUserSettings = userSettings;
        this.articleBackup = JSON.stringify(this.article);
        this.modalRef = this.modalService.show(editDlg, {class: 'modal-lg'});
      }, error => {
        this.alertify.error('Artikel details konnten nicht abgefragt werden: ' + error);
      });
  }

  private switchEditMode() {
    if (!this.editMode) {
      this.articleData.getArticleUserSettings(this.article.id, this.environmentId)
        .subscribe(userSettings => {
          this.articleUserSettings = userSettings;
          this.articleBackup = JSON.stringify(this.article);
          this.editMode = true;
        }, error => {
          this.alertify.error('Artikel details konnten nicht abgefragt werden: ' + error);
        });
    } else {
      if (this.editComponent.modified) {
        this.alertify.confirm('Änderungen verwerfen?', () => {
          this.editMode = false;
          this.article = JSON.parse(this.articleBackup);
        });
      } else {
        this.editMode = false;
      }
    }
  }

  private updateArticle(editComponent: ArticleEditComponent) {
    this.articleData.updateArticle(this.article, this.articleUserSettings)
      .subscribe(value => {
        this.alertify.success('Änderungen gespeichert');
        editComponent.saved = true;
      }, error => {
        this.alertify.error('Änderungen konnten nicht gespeichert werden: ' + error);
        editComponent.saved = false;
      });
  }

  editDlg_close(editComponent: ArticleEditComponent) {
    if (editComponent.modified) {
      this.alertify.confirm('Änderungen verwerfen?', () => {
        this.article = JSON.parse(this.articleBackup);
        this.modalRef.hide();
      });
    } else {
      this.modalRef.hide();
    }
  }
}
