import {EventEmitter, Injectable, Output} from '@angular/core';
import {Observable} from 'rxjs';
import {PaginatedResult} from '../_models/pagination';
import {Article} from '../_models/article';
import {HttpClient, HttpParams} from '@angular/common/http';
import {User} from '../_models/user';
import {environment} from '../../environments/environment';
import {Permission} from '../_models/permission';
import {AlertifyService} from './alertify.service';
import {Invitation} from '../_models/invitation';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  baseUrl = environment.apiUrl + 'users/';

  invitationsCountUpdated = new EventEmitter<number>();

  constructor(private http: HttpClient) {
  }

  getArticles(pageNumber: number, pageSize: number): Observable<PaginatedResult<Article[]>> {
    return new Observable<PaginatedResult<Article[]>>();
  }

  getUser(userId: number): Observable<User> {
    return this.http.get<User>(this.baseUrl + userId);
  }

  updateUserPermissions(environmentId: number, newPermissions: Permission): Observable<object> {
    return this.http.put(this.baseUrl + 'UpdatePermission/', newPermissions);
  }

  addEnvironment(userId: number): Observable<Object> {
    return this.http.post(this.baseUrl + 'AddEnvironment/' + userId, {});
  }

  deleteEnvironment(userId: number, envId: number): Observable<Object> {
    return this.http.post(this.baseUrl + 'DeleteEnvironment/' + userId + '/' + envId, {});
  }

  updateInvitationsCount(userId: number) {
    this.http.get<number>(this.baseUrl + 'InvitationsCount/' + userId)
      .subscribe(count => {
        this.invitationsCountUpdated.emit(count);
      }, error => {
        console.log('Einladungen konnten nicht abgefragt werden');
        console.log(error);
      });
  }

  getInvitations(userId: number): Observable<Invitation[]> {
    return this.http.get<Invitation[]>(this.baseUrl + 'invitations/' + userId);
  }

  answerInvitation(userId: any, environmentId: number, answer: number): Observable<Object> {
    const params = new HttpParams()
      .append('environmentId', environmentId.toString())
      .append('answer', answer.toString());

    return this.http.post(this.baseUrl + 'AnswerInvitation/' + userId, {}, {params: params});
  }
}
