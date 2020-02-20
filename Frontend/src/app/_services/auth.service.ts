import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {JwtHelperService} from '@auth0/angular-jwt';
import {Observable} from 'rxjs';
import {UserForLogin} from '../_models/user-for-login';
import {environment} from '../../environments/environment';
import {UserToken} from '../_models/userToken';
import {EventEmitter, Injectable, Output} from '@angular/core';
import {Router} from '@angular/router';
import {UserForRegistration} from '../_models/user-for-registration';
import {User} from '../_models/user';
import {IdentityToken} from '../_models/identity-token';
import {LocalStorageItemNames} from '../_enums/token-names.enum';

@Injectable()
export class AuthService {
  @Output() onLogin = new EventEmitter();
  @Output() onLogout = new EventEmitter();
  decodedToken: IdentityToken;
  currentUser: UserToken;
  private baseUrl = environment.apiUrl + 'auth/';

  constructor(private http: HttpClient, private router: Router, private jwtHelper: JwtHelperService) {
  }

  login(user: UserForLogin): Observable<void> {
    return this.http.post(this.baseUrl + 'login', user)
      .pipe(
        map((response: any) => {
          if (response) {
            this.saveTokens(response);
            this.onLogin.emit();
          }
        })
      );
  }

  logout() {
    localStorage.removeItem(LocalStorageItemNames.identityToken);
    localStorage.removeItem('user');
    this.decodedToken = null;

    this.currentUser = null;
    this.onLogout.emit();
    this.router.navigate(['/']);
  }

  loggedIn(): boolean {
    const token = localStorage.getItem(LocalStorageItemNames.identityToken);
    return !this.jwtHelper.isTokenExpired(token);
  }

  register(newUser: UserForRegistration): Observable<HttpResponse<User>> {
    return this.http.post<User>(this.baseUrl + 'register', newUser, {observe: 'response'});
  }

  userExists(username: string): Observable<boolean> {
    const params = new HttpParams()
      .append('username', username);

    return this.http.get<boolean>(this.baseUrl + 'UserExists/' + this.decodedToken.nameid, {params: params});
  }

  reloadToken() {
    const token = localStorage.getItem(LocalStorageItemNames.identityToken);
    const user: UserToken = JSON.parse(localStorage.getItem('user'));

    if (token) {
      this.decodedToken = this.jwtHelper.decodeToken(token);
    }

    if (user) {
      this.currentUser = user;
    }
  }

  private saveTokens(response: any) {
    localStorage.setItem(LocalStorageItemNames.identityToken, response.identityToken);
    localStorage.setItem(LocalStorageItemNames.permissionsToken, response.permissionsToken);
    localStorage.setItem(LocalStorageItemNames.settings, JSON.stringify(response.settings));
    localStorage.setItem('user', JSON.stringify(response.mappedUser));
    this.decodedToken = this.jwtHelper.decodeToken(response.token);
    this.currentUser = response.mappedUser;
  }
}
