import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {BsLocaleService, defineLocale, deLocale} from 'ngx-bootstrap';
import {ArticlesService} from '../../_services/articles.service';
import {Article} from '../../_models/article';
import {ArticleStockComponent} from '../article-stock/article-stock.component';
import {NgForm} from '@angular/forms';
import {PaginatedResult} from '../../_models/pagination';
import {StockEntry} from '../../_models/stock.entry';

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
}
