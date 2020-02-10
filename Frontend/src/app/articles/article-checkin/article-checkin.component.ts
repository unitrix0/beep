import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CheckIn} from '../../_models/check-in';
import '../../_helpers/date-extensions';
import {Article} from '../../_models/article';
import {ArticlesService} from '../../_services/articles.service';
import {AlertifyService} from '../../_services/alertify.service';
import {DateSuggestions} from '../../_models/date.suggestions';


@Component({
  selector: 'app-article-checkin',
  templateUrl: './article-checkin.component.html',
  styleUrls: ['./article-checkin.component.css']
})
export class ArticleCheckinComponent implements OnInit {
  @Input() article: Article;
  @Input() articleUserSettings: ArticleUserSettings;
  @Output() doneOrCanceled = new EventEmitter();

  expireDateSuggestion = new Date(Date.now());
  stockEntry = new class implements CheckIn {
    clientTimezoneOffset: number;
    articleId: number;
    barcode: string;
    environmentId: number;
    expireDate: Date;
    amountOnStock: number;
    usualLifetime: number;
  };

  constructor(private articleData: ArticlesService, private alertify: AlertifyService) {
  }

  ngOnInit() {
    this.articleData.getArticleDateSuggestions(this.article.barcode, this.articleUserSettings.environmentId)
      .subscribe((suggestions: DateSuggestions) => {
        const newEntry = new class implements CheckIn {
          clientTimezoneOffset = new Date().getTimezoneOffset() * -1;
          articleId: number;
          barcode: string;
          environmentId: number;
          expireDate = new Date(suggestions.lastExpireDate);
          amountOnStock = 1;
          usualLifetime: number;
        };

        this.expireDateSuggestion = new Date(this.expireDateSuggestion.addMilliseconds(suggestions.usualLifetime));
        this.stockEntry = newEntry;
      });
  }

  saveStockEntry() {
    const today = new Date();

    this.stockEntry.usualLifetime = this.stockEntry.expireDate.getTime() - today.today().getTime();
    this.stockEntry.barcode = this.article.barcode;
    this.stockEntry.environmentId = this.articleUserSettings.environmentId;
    this.stockEntry.articleId = this.article.id;

    this.articleData.saveStockEntry(this.stockEntry)
      .subscribe(value => {
        this.alertify.success('Artikel eingebucht');
        this.doneOrCanceled.emit();
      }, error => {
        console.log(error);
        this.alertify.error('Artikel konnte nicht eingebucht werden: ' + error.message);
      });
  }

  adjustAmount(direction: string) {
    switch (direction) {
      case '+':
        this.stockEntry.amountOnStock++;
        break;
      case '-':
        if (this.stockEntry.amountOnStock > 0) {
          this.stockEntry.amountOnStock--;
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

  useSuggestedDate() {
    this.stockEntry.expireDate = new Date(this.expireDateSuggestion.today());
  }
}
