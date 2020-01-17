import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {BsLocaleService, defineLocale, deLocale, TabDirective} from 'ngx-bootstrap';
import {ArticlesService} from '../../_services/articles.service';
import {Article} from '../../_models/article';
import {ArticleStockComponent} from '../article-stock/article-stock.component';
import {AuthService} from '../../_services/auth.service';
import {NgForm} from '@angular/forms';

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
  @ViewChild(ArticleStockComponent) stockComponent: ArticleStockComponent;
  @ViewChild('f') form: NgForm;
  saved = false;

  constructor(private localeService: BsLocaleService, private articleData: ArticlesService) {
  }

  private _modified: boolean;
  get modified(): boolean {
    return this.form.touched && !this.saved;
  }

  ngOnInit() {
    this.localeService.use('de');
  }

  saveArticle() {
    const args = {success: this.saved};
    this.save.emit(args);
    this.saved = args.success;
  }

  onSelectTab(tab: TabDirective) {
    if (tab.id === '3') {
      this.stockComponent.loadData(1);
    }
  }
}
