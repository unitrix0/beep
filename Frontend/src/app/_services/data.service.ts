import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {PaginatedResult} from '../_models/pagination';
import {Article} from '../_models/article';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() {
  }

  getArticles(pageNumber: number, pageSize: number): Observable<PaginatedResult<Article[]>> {
    return  new Observable<PaginatedResult<Article[]>>();
  }
}
