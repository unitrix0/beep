import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {JwtHelperService} from '@auth0/angular-jwt';
import {Observable} from 'rxjs';
import {UserForLogin} from '../_models/user-for-login';
import {environment} from '../../environments/environment';
import {UserToken} from '../_models/userToken';
import {Injectable, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UserForRegistration} from '../_models/user-for-registration';
import {User} from '../_models/user';
import {PermissionFlags} from '../_enums/permission-flags.enum';

@Injectable()
export class AuthService {
  decodedToken: any;
  currentUser: UserToken;

  get permissions(): PermissionFlags {
    return this.parsePermissions(this.decodedToken.permissions);
    ;
  }

  private jwtHelper = new JwtHelperService();
  private baseUrl = environment.apiUrl + 'auth/';

  constructor(private http: HttpClient, private router: Router) {
  }

  login(user: UserForLogin): Observable<void> {
    return this.http.post(this.baseUrl + 'login', user)
      .pipe(
        map((response: any) => {
          if (response) {
            // Write the values to localStorage for later usage
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.mappedUser));
            this.decodedToken = this.jwtHelper.decodeToken(response.token);
            this.currentUser = response.mappedUser;
          }
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    this.decodedToken = null;
    this.currentUser = null;

    this.router.navigate(['/']);
  }

  loggedIn(): boolean {
    const token = localStorage.getItem('token');
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

  updatePermissionClaims(newEnvironmentId: number): Observable<void> {
    const params = new HttpParams()
      .append('environmentId', newEnvironmentId.toString());

    return this.http.get(this.baseUrl + 'UpdatePermissionClaims/' + this.decodedToken.nameid, {params: params})
      .pipe(
        map((response: any) => {
          if (response) {
            // Write the values to localStorage for later usage
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.mappedUser));
            this.decodedToken = this.jwtHelper.decodeToken(response.token);
            this.currentUser = response.mappedUser;
          }
        })
      );
  }

  private parsePermissions(permissionsString: string): PermissionFlags {
    let perms: PermissionFlags;
    const permissionChars = permissionsString.split('').reverse();

    for (let i = 0; i < permissionChars.length; i++) {
      if (permissionChars[i] === '1') {
        const newFlag: PermissionFlags = PermissionFlags[PermissionFlags[Math.pow(2, i)]];
        perms |= newFlag;
      }
    }

    console.log('userPermission parsed: ' + perms);
    return perms;
  }
}
