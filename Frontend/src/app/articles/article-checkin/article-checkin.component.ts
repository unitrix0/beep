import {Component, Input, OnInit} from '@angular/core';
import {CheckIn} from '../../_models/check-in';
import '../../_helpers/date-extensions';
import {Article} from '../../_models/article';
import {ArticlesService} from '../../_services/articles.service';
import {AlertifyService} from '../../_services/alertify.service';


@Component({
  selector: 'app-article-checkin',
  templateUrl: './article-checkin.component.html',
  styleUrls: ['./article-checkin.component.css']
})
export class ArticleCheckinComponent implements OnInit {
  @Input() article: Article;

  stockEntry = new class implements CheckIn {
    articleId: number;
    barcode: string;
    environmentId: number;
    expireDate: Date;
    stockAmount: number;
    usualLifetime: number;
  };

  constructor(private articleData: ArticlesService, private alertify: AlertifyService) {
  }

  ngOnInit() {
    this.articleData.getUsualLifetime(this.article.barcode, this.article.articleUserSettings.environmentId)
      .subscribe(usualLifetime => {
        console.log(usualLifetime);

        const newEntry = new class implements CheckIn {
          articleId: number;
          barcode: string;
          environmentId: number;
          expireDate = new Date();
          stockAmount = 0;
          usualLifetime: number;
        };

        newEntry.expireDate.addMilliseconds(usualLifetime);
        this.stockEntry = newEntry;
      });
  }

  saveStockEntry() {
    this.stockEntry.usualLifetime = this.stockEntry.expireDate.getTime() - Date.now();
    this.stockEntry.barcode = this.article.barcode;
    this.stockEntry.environmentId = this.article.articleUserSettings.environmentId;
    this.stockEntry.articleId = this.article.id;
    console.log(this.stockEntry);

    this.articleData.saveStockEntry(this.stockEntry)
      .subscribe(value => {
        this.alertify.success('Artikel eingebucht');
      }, error => {
        console.log(error);
        this.alertify.error('Artikel konnte nicht eingebucht werden: ' + error.message);
      });
  }

  adjustAmount(direction: string) {
    switch (direction) {
      case '+':
        this.stockEntry.stockAmount++;
        break;
      case '-':
        if (this.stockEntry.stockAmount > 0) {
          this.stockEntry.stockAmount--;
        }
        break;
    }
  }

  decreaseExpireDate(part: string) {
    switch (part) {
      case 'd':
        this.stockEntry.expireDate = new Date(this.stockEntry.expireDate.addDays(-1));
        break;
      case 'm':
        this.stockEntry.expireDate = new Date(this.stockEntry.expireDate.addMonths(-1));
        break;
      case 'y':
        this.stockEntry.expireDate = new Date(this.stockEntry.expireDate.addYears(-1));
        break;
    }
  }

  increaseExpireDate(part: string) {
    switch (part) {
      case 'd':
        this.stockEntry.expireDate = new Date(this.stockEntry.expireDate.addDays(1));
        break;
      case 'm':
        this.stockEntry.expireDate = new Date(this.stockEntry.expireDate.addMonths(1));
        break;
      case 'y':
        this.stockEntry.expireDate = new Date(this.stockEntry.expireDate.addYears(1));
        break;
    }
  }
}
