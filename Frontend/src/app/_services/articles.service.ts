import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PaginatedResult, Pagination} from '../_models/pagination';
import {Article} from '../_models/article';
import {environment} from '../../environments/environment';
import {ArticlesFilter} from '../_models/articles-filter';
import {map} from 'rxjs/operators';
import {Unit} from '../_models/unit';
import {ArticleGroup} from '../_models/article-group';
import {CheckIn} from '../_models/check-in';
import {StockEntry} from '../_models/stock.entry';
import {DateSuggestions} from '../_models/date.suggestions';
import {Store} from '../_models/store';
import {PagedStockList} from '../_models/paged-stock-list';
import {ActivityLogEntry} from '../_models/activity-log-entry';
import {ArticleUserSettings} from '../_models/articleUserSettings';
import {PermissionsService} from './permissions.service';
import {AuthService} from './auth.service';
import {LocalStorageItemNames} from '../_enums/local-storage-item-names.enum';

@Injectable({
  providedIn: 'root'
})

export class ArticlesService {
  units: Unit[];
  articleGroups: ArticleGroup[];
  stores: Store[];
  private baseUrl = environment.apiUrl + 'articles/';

  constructor(private http: HttpClient, private permissions: PermissionsService, authService: AuthService) {
    authService.onLogin.subscribe(() => {
      this.getBaseData();
    });
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

  updateArticle(article: Article, articleUserSettings: ArticleUserSettings): Observable<object> {
    return this.http.put(this.baseUrl + 'UpdateArticle', {article: article, articleUserSettings: articleUserSettings});
  }

  saveStockEntry(stockEntry: CheckIn): Observable<Article> {
    return this.http.post<Article>(this.baseUrl + 'AddStockEntry', stockEntry);
  }

  getArticleDateSuggestions(barcode: string, environmentId: string): Observable<DateSuggestions> {
    return this.http.get<DateSuggestions>(this.baseUrl + 'GetArticleDateSuggestions/' + barcode + '/' + environmentId);
  }

  getArticleStock(articleId: number, environmentId: string, pageNumber: number): Observable<PagedStockList> {
    const params = new HttpParams()
      .append('pageNumber', pageNumber.toString())
      .append('itemsPerPage', '3')
      .append('articleId', articleId.toString())
      .append('environmentId', environmentId);

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

  getArticleUserSettings(articleId: number, environmentId: string): Observable<ArticleUserSettings> {
    const p = new HttpParams()
      .append('articleId', articleId.toString())
      .append('environmentId', environmentId);

    return this.http.get<ArticleUserSettings>(this.baseUrl + 'GetArticleUserSettings/', {params: p});
  }

  getActivityLog(environmentId: string): Observable<ActivityLogEntry[]> {
    return this.http.get<ActivityLogEntry[]>(this.baseUrl + 'GetActivityLog/' + environmentId);
  }

  addArticleGroup(environmentId: string, groupName: string): Observable<ArticleGroup> {
    return this.http.post<ArticleGroup>(this.baseUrl + 'AddArticleGroup/' + environmentId, {environmentId: environmentId, name: groupName})
      .pipe(map(newGroup => {
        this.articleGroups.push(newGroup);
        localStorage.setItem(LocalStorageItemNames.articleGroups, JSON.stringify(this.articleGroups));
        return newGroup;
      }));
  }

  articleGroupHasMembers(groupId: number, environmentId: string) {
    return this.http.get<boolean>(this.baseUrl + 'ArticleGroupHasMembers/' + environmentId + '/' + groupId);
  }

  deleteArticleGroup(groupId: number, environmentId: string) {
    return this.http.delete(this.baseUrl + 'DeleteArticleGroup/' + environmentId + '/' + groupId)
      .pipe(map(() => {
        const deletedGroupIdx = this.articleGroups.findIndex(g => g.id === groupId);
        this.articleGroups.splice(deletedGroupIdx, 1);
        localStorage.setItem(LocalStorageItemNames.articleGroups, JSON.stringify(this.articleGroups));
      }));
  }

  reloadBaseData() {
    this.units = JSON.parse(localStorage.getItem(LocalStorageItemNames.units));
    this.articleGroups = JSON.parse(localStorage.getItem(LocalStorageItemNames.articleGroups));
    this.stores = JSON.parse(localStorage.getItem(LocalStorageItemNames.stores));
  }

  getBaseData() {
    this.http.get(this.baseUrl + 'GetBaseData/' + this.permissions.token.environment_id)
      .subscribe((response: { units, articleGroups, stores }) => {
        this.units = response.units;
        this.articleGroups = response.articleGroups;
        this.stores = response.stores;
        localStorage.setItem(LocalStorageItemNames.units, JSON.stringify(this.units));
        localStorage.setItem(LocalStorageItemNames.articleGroups, JSON.stringify(this.articleGroups));
        localStorage.setItem(LocalStorageItemNames.stores, JSON.stringify(this.stores));
      });
  }


}
