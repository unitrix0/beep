import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {PaginatedResult} from '../_models/pagination';
import {Article} from '../_models/article';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AlertifyService} from '../_services/alertify.service';
import {ArticlesService} from '../_services/articles.service';
import {ArticlesFilter} from '../_models/articles-filter';
import {PermissionsService} from '../_services/permissions.service';
import {error} from '@angular/compiler/src/util';

@Injectable()
export class ArticlesResolver implements Resolve<PaginatedResult<Article[]>> {
  pageNumber = 1;
  pageSize = 8;

  constructor(private dataService: ArticlesService, private router: Router, private alertify: AlertifyService,
              private permissions: PermissionsService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PaginatedResult<Article[]>> {
    const environmentId = this.permissions.token.environment_id;
    const filter: ArticlesFilter = new class implements ArticlesFilter {
      environmentId: string = environmentId;
      isOnStock = false;
      isOpened = false;
      keepOnStock = false;
      nameOrEan = '';
      storeId = 0;
    };
    return this.dataService.getArticles(this.pageNumber, this.pageSize, filter).pipe(
      catchError(err => {
        console.log(err);
        this.alertify.error('Fehler beim Abfragen der Daten: ' + err);
        return of(null);
      })
    );
  }
}
