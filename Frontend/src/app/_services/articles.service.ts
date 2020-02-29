import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PaginatedResult, Pagination} from '../_models/pagination';
import {Article} from '../_models/article';
import {environment} from '../../environments/environment';
import {ArticlesFilter} from '../_models/articles-filter';
import {map} from 'rxjs/operators';
import {Unit} from '../_models/unit';
import {StockMode} from '../_models/stock-mode';
import {ArticleGroup} from '../_models/article-group';
import {CheckIn} from '../_models/check-in';
import {StockEntry} from '../_models/stock.entry';
import {DateSuggestions} from '../_models/date.suggestions';
import {Store} from '../_models/store';
import {PagedStockList} from '../_models/paged-stock-list';
import {ActivityLogEntry} from '../_models/activity-log-entry';

@Injectable({
  providedIn: 'root'
})

export class ArticlesService {
  units: Unit[];
  keepStockModes: StockMode[];
  articleGroups: ArticleGroup[];
  stores: Store[];
  private baseUrl = environment.apiUrl + 'articles/';

  constructor(private http: HttpClient) {
    this.getBaseData();
    this.keepStockModes = [
      {id: 1, label: 'Artikel an Lager halten'},
      {id: 2, label: 'Artikelgruppe an Lager halten'}
    ];
  }

  getArticles(pageNumber: number, pageSize: number, filter: ArticlesFilter):
    Observable<PaginatedResult<Article[]>> {
    const params = new HttpParams()
      .append('pageNumber', pageNumber.toString())
      .append('pageSize', pageSize.toString())
      .append('environmentId', filter.environmentId.toString())
      .append('isOpened', String(filter.isOpened))
      .append('keepOnStock', String(filter.keepOnStock))
      .append('isOnStock', String(filter.isOnStock))
      .append('nameOrEan', filter.nameOrEan);

    return this.http.get<Article[]>(this.baseUrl + 'GetArticles', {observe: 'response', params: params})
      .pipe(
        map(response => {
          const result: PaginatedResult<Article[]> = new PaginatedResult<Article[]>();
          result.content = response.body;
          if (response.headers.get('Pagination') != null) {
            result.pagination = JSON.parse(response.headers.get('Pagination'));
          }
          return result;
        }));
  }

  lookupArticle(barcode: string): Observable<Article> {
    return this.http.get<Article>(this.baseUrl + 'LookupArticle/' + barcode);
  }

  createArticle(article: Article): Observable<Article> {
    return this.http.post<Article>(this.baseUrl + 'CreateArticle', article);
  }

  createArticleUserSettings(aus: ArticleUserSettings): Observable<ArticleUserSettings> {
    return this.http.post<ArticleUserSettings>(this.baseUrl + 'CreateArticleUserSettings', aus);
  }

  updateArticle(article: Article): Observable<object> {
    return this.http.patch(this.baseUrl + 'UpdateArticle', article);
  }

  saveStockEntry(stockEntry: CheckIn): Observable<Article> {
    return this.http.post<Article>(this.baseUrl + 'AddStockEntry', stockEntry);
  }

  getArticleDateSuggestions(barcode: string, environmentId: number): Observable<DateSuggestions> {
    return this.http.get<DateSuggestions>(this.baseUrl + 'GetArticleDateSuggestions/' + barcode + '/' + environmentId);
  }

  getArticleStock(articleId: number, environmentId: number, pageNumber: number): Observable<PagedStockList> {
    const params = new HttpParams()
      .append('pageNumber', pageNumber.toString())
      .append('itemsPerPage', '3')
      .append('articleId', articleId.toString())
      .append('environmentId', environmentId.toString());

    return this.http.get<StockEntry[]>(this.baseUrl + 'GetArticleStock', {observe: 'response', params: params})
      .pipe(
        map(response => {
          const result: PagedStockList = new PagedStockList();
          result.content = response.body;
          if (response.headers.get('Pagination') != null) {
            result.pagination = JSON.parse(response.headers.get('Pagination'));
          }
          if (response.headers.get('TotalStockAmount') != null) {
            result.totalStockAmount = parseInt(response.headers.get('TotalStockAmount'), 10);
          }
          return result;
        })
      );
  }

  getUnitAbbreviation(unitId: number): string {
    return this.units.find(u => u.id === unitId).abbreviation;
  }

  checkOutById(entryId: number, amount: number): Observable<Object> {
    const parameters = new HttpParams()
      .append('entryId', entryId.toString())
      .append('amount', amount.toString());

    return this.http.delete(this.baseUrl + 'CheckOutById/', {params: parameters});
  }

  openArticle(stockEntry: StockEntry): Observable<object> {
    return this.http.put(this.baseUrl + 'OpenArticle/', stockEntry);
  }

  getArticleUserSettings(articleId: number, environmentId: number): Observable<ArticleUserSettings> {
    const p = new HttpParams()
      .append('articleId', articleId.toString())
      .append('environmentId', environmentId.toString());

    return this.http.get<ArticleUserSettings>(this.baseUrl + 'GetArticleUserSettings/', {params: p});
  }

  getActivityLog(environmentId: number): Observable<ActivityLogEntry[]> {
    return this.http.get<ActivityLogEntry[]>(this.baseUrl + 'GetActivityLog/' + environmentId);
  }

  private getBaseData() {
    this.http.get(this.baseUrl + 'GetBaseData').subscribe((response: { units, articleGroups, stores }) => {
      this.units = response.units;
      this.articleGroups = response.articleGroups;
      this.stores = response.stores;
    });
  }
}
