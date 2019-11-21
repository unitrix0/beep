import {EventEmitter, Injectable, Output} from '@angular/core';
import {Observable} from 'rxjs';
import {PaginatedResult} from '../_models/pagination';
import {Article} from '../_models/article';
import {HttpClient, HttpParams} from '@angular/common/http';
import {User} from '../_models/user';
import {environment} from '../../environments/environment';
import {Permission} from '../_models/permission';
import {UserInvitations} from '../_models/user-invitations';
import {NewInvitation} from '../_models/new-invitation';
import {BeepEnvironment} from '../_models/beep-environment';

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

  getInvitations(userId: number): Observable<UserInvitations> {
    return this.http.get<UserInvitations>(this.baseUrl + 'invitations/' + userId);
  }

  answerInvitation(userId: any, environmentId: number, answer: number): Observable<Object> {
    const params = new HttpParams()
      .append('environmentId', environmentId.toString())
      .append('answer', answer.toString());

    return this.http.post(this.baseUrl + 'AnswerInvitation/' + userId, {}, {params: params});
  }

  deleteInvitation(userId: number, inviteeId: number, environmentId: number): Observable<Object> {
    const params = new HttpParams()
      .append('environmentId', environmentId.toString())
      .append('inviteeId', inviteeId.toString());

    return this.http.delete(this.baseUrl + 'DeleteInvitation/' + userId, {params: params});
  }

  deleteAnsweredInvitations(userId: number): Observable<Object> {
    return this.http.delete(this.baseUrl + 'DeleteAnsweredInvitations/' + userId);
  }

  inviteMember(recipient: string, environmentId: number, sendMail: boolean): Observable<Object> {
    const invitation: NewInvitation = new class implements NewInvitation {
      environmentId: number = environmentId;
      inviteeName: string = recipient;
      sendMail: boolean = sendMail;
    };

    return this.http.post(this.baseUrl + 'invite', invitation);
  }


  removeMember(userId: number, environmentId: number, removeUserId: number): Observable<object> {
    const params = new HttpParams()
      .append('environmentId', environmentId.toString())
      .append('removeUserId', removeUserId.toString());

    return this.http.delete(this.baseUrl + 'RemoveUser/' + userId, {params: params});
  }

  getEnvironments(userId: number): Observable<BeepEnvironment[]> {
    return this.http.get<BeepEnvironment[]>(this.baseUrl + 'GetEnvironments/' + userId);
  }

  getEnvironmentPermissions(environmentId: number, userId: number): Observable<Permission[]> {
    const params = new HttpParams()
      .append('environmentId', environmentId.toString());

    return this.http.get<Permission[]>(this.baseUrl + 'GetEnvironmentPermissions/' + userId, {params: params});
  }
}
