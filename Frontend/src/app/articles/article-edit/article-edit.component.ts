import {Component, OnInit} from '@angular/core';
import {BsLocaleService, defineLocale, deLocale} from 'ngx-bootstrap';
import {Article} from '../../_models/article';
import {ArticlesService} from '../../_services/articles.service';

defineLocale('de', deLocale);

@Component({
  selector: 'app-article-edit',
  templateUrl: './article-edit.component.html',
  styleUrls: ['./article-edit.component.css']
})
export class ArticleEditComponent implements OnInit {
  tabStyle = {'height': '150px'};
  private userSettings: ArticleUserSettings = new class implements ArticleUserSettings {
    amountOnStock: number;
    isOpened: boolean;
    keepStockAmount: number;
    keepStockMode: number;
    openedOn: Date;
    unitId: number;
  };
  article: Article = new class implements Article {
    id: number;
    userSettings: ArticleUserSettings = this.userSettings;
    barcode: string;
    groupId: number;
    hasLifetime: boolean;
    imageUrl: string;
    name: string;
    typicalLifetime: number;
    unitId: number;
  };

  constructor(private localeService: BsLocaleService, private articleData: ArticlesService) {
  }

  ngOnInit() {
    this.localeService.use('de');
  }

}
