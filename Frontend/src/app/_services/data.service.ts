import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {PaginatedResult} from '../_models/pagination';
import {Article} from '../_models/article';
import {HttpClient} from '@angular/common/http';
import {User} from '../_models/user';
import {environment} from '../../environments/environment';
import {Permission} from '../_models/permission';
import {BeepEnvironment} from '../_models/beep-environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  baseUrl = environment.apiUrl + 'users/';

  constructor(private http: HttpClient) {
  }

  getArticles(pageNumber: number, pageSize: number): Observable<PaginatedResult<Article[]>> {
    return new Observable<PaginatedResult<Article[]>>();
  }

  getUser(userId: number): Observable<User> {
    return this.http.get<User>(this.baseUrl + userId);
  }

  updateUserPermissions(environmentId: number, newPermissions: Permission): Observable<object> {
    return this.http.put(this.baseUrl + 'UpdatePermission/' + newPermissions.userId, newPermissions);
  }

  addEnvironment(userId: number): Observable<object> {
    return this.http.post(this.baseUrl + 'AddEnvironment/' + userId, null);
  }

  getEnvironments(userId: number): Observable<BeepEnvironment[]> {
    return this.http.get<BeepEnvironment[]> (this.baseUrl + 'GetEnvironments/' + userId);
  }
}
