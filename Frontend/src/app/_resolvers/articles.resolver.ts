import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {PaginatedResult, Pagination} from '../_models/pagination';
import {Article} from '../_models/article';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AlertifyService} from '../_services/alertify.service';
import {ArticlesService} from '../_services/articles.service';
import {AuthService} from '../_services/auth.service';

@Injectable()
export class ArticlesResolver implements Resolve<PaginatedResult<Article[]>> {
  pageNumber = 1;
  pageSize = 5;

  constructor(private dataService: ArticlesService, private router: Router, private alertify: AlertifyService, private authService: AuthService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PaginatedResult<Article[]>> {
    const environmentId = this.authService.decodedToken.environment_id;
    return this.dataService.getArticles(environmentId, this.pageNumber, this.pageSize).pipe(
      catchError(err => {
        this.alertify.error('Fehler beim Abfragen der Daten: ' + err.message);
        return of(null);
      })
    );
  }
}
