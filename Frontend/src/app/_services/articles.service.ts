import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PaginatedResult} from '../_models/pagination';
import {Article} from '../_models/article';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {
  baseUrl = environment.apiUrl + 'articles/';

  constructor(private http: HttpClient) {
  }

  getArticles(environmentId: number, pageNumber: number, pageSize: number): Observable<PaginatedResult<Article[]>> {
    // https://image.migros.ch/product-zoom/eb6de3ee0cba4b4aeb0ec22bc4599441d85f68b4/mousse-chocolat.jpg"
    return this.http.get<PaginatedResult<Article[]>>(this.baseUrl + environmentId);
  }
}
