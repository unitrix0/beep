import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Article} from '../_models/article';
import {ArticlesService} from '../_services/articles.service';
import {ArticlesFilter} from '../_models/articles-filter';
import {PaginatedResult, Pagination} from '../_models/pagination';
import {AlertifyService} from '../_services/alertify.service';
import {PageChangedEvent} from 'ngx-bootstrap';
import {PermissionsService} from '../_services/permissions.service';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})
export class ArticlesComponent implements OnInit {
  articles: Article[];
  filter: ArticlesFilter = {environmentId: 0, storeId: 0, isOpened: false, keepOnStock: false, isOnStock: false, nameOrEan: ''};
  pagination: Pagination;

  constructor(private data: ArticlesService, private route: ActivatedRoute, private alertify: AlertifyService,
              private permissions: PermissionsService) {
  }

  ngOnInit() {
    this.filter.environmentId = this.permissions.token.environment_id;
    this.route.data.subscribe(data => {
      this.articles = data['articles'].content;
      this.pagination = data['articles'].pagination;
    }, error => {
      this.alertify.error('Artikel konnten nicht abgefragt werden: ' + error.message);
    });
  }

  setFilter() {
    this.LoadData(1);
  }

  pageChanged(eventArgs: PageChangedEvent) {
    this.LoadData(eventArgs.page);
  }

  environmentChanged() {
    this.filter.environmentId = this.permissions.token.environment_id;
    this.setFilter();
  }

  private LoadData(page: number) {
    this.data.getArticles(page, this.pagination.itemsPerPage, this.filter)
      .subscribe((value: PaginatedResult<Article[]>) => {
        this.articles = value.content;
        this.pagination = value.pagination;
      }, error => {
        this.alertify.error('Artikel konnten nicht abgefragt werden: ' + error.message);
      });
  }
}
