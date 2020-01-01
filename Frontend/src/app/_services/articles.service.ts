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

@Injectable({
  providedIn: 'root'
})

export class ArticlesService {
  units: Unit[];
  keepStockModes: StockMode[];
  articleGroups: ArticleGroup[];
  private baseUrl = environment.apiUrl + 'articles/';

  constructor(private http: HttpClient) {
    this.getBaseData();
    this.keepStockModes = [
      {id: 1, label: 'Artikel an Lager halten'},
      {id: 2, label: 'Artikelgruppe an Lager halten'}
    ];
  }

  getArticles(environmentId: number, pageNumber: number, itemsPerPage: number, filter?: ArticlesFilter):
    Observable<PaginatedResult<Article[]>> {
    const params = new HttpParams()
      .append('pageNumber', pageNumber.toString())
      .append('itemsPerPage', itemsPerPage.toString());

    if (filter != null) {
      params.append('storeId', filter.storeId.toString())
        .append('isOpened', String(filter.isOpened))
        .append('keepOnStock', String(filter.keepOnStock))
        .append('isOnStock', String(filter.isOnStock))
        .append('nameOrEan', filter.nameOrEan);
    }
    return this.http.get<Article[]>(this.baseUrl + environmentId, {observe: 'response', params: params})
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

  lookupArticle(barcode: string, environmentId: number): Observable<Article> {
    return this.http.get<Article>(this.baseUrl + 'LookupArticle/' + barcode + '/' + environmentId);
  }

  saveArticle(article: Article): Observable<Article> {
    return this.http.post<Article>(this.baseUrl + 'SaveArticle', article);
  }

  saveStockEntry(stockEntry: CheckIn): Observable<Article> {
    return this.http.post<Article>(this.baseUrl + 'AddStockEntry', stockEntry);
  }

  getUsualLifetime(barcode: string, environmentId: number): Observable<number> {
    return this.http.get<number>(this.baseUrl + 'GetUsualLifetime/' + barcode + '/' + environmentId);
  }

  getArticleStock(articleId: number, environmentId: number, pageNumber: number): Observable<PaginatedResult<StockEntry[]>> {
    const params = new HttpParams()
      .append('pageNumber', pageNumber.toString())
      .append('itemsPerPage', '3')
      .append('articleId', articleId.toString())
      .append('environmentId', environmentId.toString());

    return this.http.get<StockEntry[]>(this.baseUrl + 'GetArticleStock', {observe: 'response', params: params})
      .pipe(
        map(response => {
          const result: PaginatedResult<StockEntry[]> = new PaginatedResult<StockEntry[]>();
          result.content = response.body;
          if (response.headers.get('Pagination') != null) {
            result.pagination = JSON.parse(response.headers.get('Pagination'));
          }
          return result;
        })
      );
  }

  private getBaseData() {
    this.http.get(this.baseUrl + 'GetBaseData').subscribe((response: { units, articleGroups }) => {
      this.units = response.units;
      this.articleGroups = response.articleGroups;
    });
  }
}
