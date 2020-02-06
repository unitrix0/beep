import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {BsLocaleService, defineLocale, deLocale} from 'ngx-bootstrap';
import {ArticlesService} from '../../_services/articles.service';
import {Article} from '../../_models/article';
import {NgForm} from '@angular/forms';
import {ArticleStore} from '../../_models/article-store';

defineLocale('de', deLocale);

@Component({
  selector: 'app-article-edit',
  templateUrl: './article-edit.component.html',
  styleUrls: ['./article-edit.component.css']
})
export class ArticleEditComponent implements OnInit {
  @Output() save = new EventEmitter();
  @Input() article: Article;
  @Input() editMode: boolean;
  @ViewChild('f') form: NgForm;
  saved = false;

  constructor(private localeService: BsLocaleService, private articleData: ArticlesService) {
  }

  get modified(): boolean {
    return this.form.touched && !this.saved;
  }

  ngOnInit() {
    this.localeService.use('de');
  }

  saveArticle() {
    this.save.emit();
  }

  articleHasStore(storeId: number): boolean {
    return this.article.stores.find(s => s.storeId === storeId) != null;
  }

  addRemoveStore(articleId: number, storeId: number) {
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
