import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {ArticlesService} from '../../_services/articles.service';
import {Article} from '../../_models/article';
import {NgForm} from '@angular/forms';
import {ArticleStore} from '../../_models/article-store';
import {PermissionsService} from '../../_services/permissions.service';
import {PermissionFlags} from '../../_enums/permission-flags.enum';
import {ArticleUserSettings} from '../../_models/articleUserSettings';
import {defineLocale, deLocale} from 'ngx-bootstrap/chronos';
import {BsLocaleService} from 'ngx-bootstrap/datepicker';
import {BsDropdownDirective} from 'ngx-bootstrap/dropdown';
import {AlertifyService} from '../../_services/alertify.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {ArticleGroup} from '../../_models/article-group';

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
  currentArticleGrpName: string;
  newArticleGroupName: string;
  delGroupRef: BsModalRef;
  private artGrpToDelete: ArticleGroup;

  constructor(private localeService: BsLocaleService, public articleData: ArticlesService, public  permissions: PermissionsService,
              private alertify: AlertifyService, private modalService: BsModalService) {
  }

  get modified(): boolean {
    return this.form.dirty && !this.saved;
  }

  ngOnInit() {
    this.setArticleGroup(this.articleUserSettings.articleGroup.id, null);
    this.localeService.use('de');
  }

  saveArticle() {
    this.save.emit(this);
  }

  storeSelected(): boolean {
    return this.article.stores.length > 0;
  }

  setArticleGroup(grpId: number, groupSelector: BsDropdownDirective) {
    if (groupSelector) {
      groupSelector.hide();
    }
    const group = this.articleData.articleGroups.find(g => g.id === grpId);
    this.currentArticleGrpName = group.name;
    this.articleUserSettings.articleGroupId = grpId;
    this.articleUserSettings.articleGroup = group;
  }

  addArticleGroup(groupSelector: BsDropdownDirective) {
    this.articleData.addArticleGroup(this.permissions.token.environment_id, this.newArticleGroupName)
      .subscribe(newGroup => {
        this.setArticleGroup(newGroup.id, null);
        groupSelector.hide();
      }, error => {
        this.alertify.error('Neue Gruppe konnte nicht angelegt werden: ' + error);
      });
  }

  checkForArticleGroupMembers(grp: ArticleGroup, delGrpDlg: TemplateRef<any>) {
    this.artGrpToDelete = grp;
    this.articleData.articleGroupHasMembers(grp.id, this.permissions.token.environment_id)
      .subscribe(hasMembers => {
        if (hasMembers) {
          this.delGroupRef = this.modalService.show(delGrpDlg);
        } else {
          this.deleteArticleGroup();
        }
      });
  }

  deleteArticleGroup() {
    this.articleData.deleteArticleGroup(this.artGrpToDelete.id, this.permissions.token.environment_id)
      .subscribe(() => {
        if (this.delGroupRef) {
          this.setArticleGroup(1, null);
          this.delGroupRef.hide();
        }
        this.alertify.success('Gelöscht');
      }, error => {
        this.alertify.error('Gruppe konnte nicht gelöscht werden: ' + error);
      });
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
