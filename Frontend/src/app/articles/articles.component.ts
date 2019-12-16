import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Article} from '../_models/article';
import {ArticlesService} from '../_services/articles.service';
import {ArticlesFilter} from '../_models/articles-filter';
import {PaginatedResult, Pagination} from '../_models/pagination';
import {AlertifyService} from '../_services/alertify.service';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})
export class ArticlesComponent implements OnInit {
  articles: Article[];
  environmentId: number;
  filter: ArticlesFilter = {storeId: 1, isOpened: false, keepOnStock: false, isOnStock: false, nameOrEan: ''};
  pagination: Pagination;

  constructor(private data: ArticlesService, private route: ActivatedRoute, private alertify: AlertifyService) {
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.articles = data['articles'].content;
      this.pagination = data['articles'].pagination;
    }, error => {
      this.alertify.error('Artikel konnten nicht abgefragt werden: ' + error.message);
    });
  }

  setFilter() {
    this.data.getArticles(this.environmentId, this.pagination.currentPage, this.pagination.itemsPerPage, this.filter)
      .subscribe((value: PaginatedResult<Article[]>) => {
        console.log('subscribe');
        console.log(value.pagination);
        this.articles = value.content;
        this.pagination = value.pagination;
        console.log(value.content);
      }, error => {
        this.alertify.error('Artikel konnten nicht abgefragt werden: ' + error.message);
      });
  }

  changed() {
    console.log('changed: ' + this.filter.isOpened);
  }
}
