import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ArticlesService} from '../../_services/articles.service';
import {Article} from '../../_models/article';
import {NgForm} from '@angular/forms';
import {ArticleStore} from '../../_models/article-store';
import {PermissionsService} from '../../_services/permissions.service';
import {PermissionFlags} from '../../_enums/permission-flags.enum';
import {ArticleUserSettings} from '../../_models/articleUserSettings';
import {defineLocale, deLocale} from 'ngx-bootstrap/chronos';
import {BsLocaleService} from 'ngx-bootstrap/datepicker';

defineLocale('de', deLocale);

@Component({
  selector: 'app-article-edit',
  templateUrl: './article-edit.component.html',
  styleUrls: ['./article-edit.component.css']
})
export class ArticleEditComponent implements OnInit {
  @Output() save = new EventEmitter<ArticleEditComponent>();
  @Output() doneOrCanceled = new EventEmitter();
  @Input() article: Article;
  @Input() articleUserSettings: ArticleUserSettings;
  /** Passt die Darstellung für den Dialog Modus an */
  @Input() dialogMode: boolean;
  /** Passt die darstellung für check-in oder bearbeitung an */
  @Input() editMode: boolean;

  @ViewChild('f', {static: true}) form: NgForm;
  saved = false;
  editArticlePermission = PermissionFlags.isOwner | PermissionFlags.editArticleSettings;

  constructor(private localeService: BsLocaleService, public articleData: ArticlesService, public  permissions: PermissionsService) {
  }

  get modified(): boolean {
    return this.form.dirty && !this.saved;
  }

  ngOnInit() {
    this.localeService.use('de');
  }

  saveArticle() {
    this.save.emit(this);
  }

  storeSelected(): boolean {
    return this.article.stores.length > 0;
  }

  private articleHasStore(storeId: number): boolean {
    return this.article.stores.find(s => s.storeId === storeId) != null;
  }

  private addRemoveStore(articleId: number, storeId: number) {
    this.form.form.markAsDirty();
    if (this.permissions.hasPermissionOr(this.editArticlePermission)) {
      const idx = this.article.stores.findIndex(s => s.storeId === storeId);
      if (idx > -1 && this.article.stores.length > 1) {
        this.article.stores.splice(idx, 1);
      } else {
        const item: ArticleStore = new class implements ArticleStore {
          articleId = articleId;
          storeId = storeId;
        };
        this.article.stores.push(item);
      }
    }
  }
}
