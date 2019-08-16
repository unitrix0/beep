import {HttpClient, HttpResponse} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {JwtHelperService} from '@auth0/angular-jwt';
import {Observable} from 'rxjs';
import {UserForLogin} from '../_models/user-for-login';
import {environment} from '../../environments/environment';
import {UserToken} from '../_models/userToken';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {UserForRegistration} from '../_models/user-for-registration';
import {User} from '../_models/user';

@Injectable()
export class AuthService {
  decodedToken: any;
  currentUser: UserToken;
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

  Register(newUser: UserForRegistration): Observable<HttpResponse<User>> {
    return this.http.post<User>(this.baseUrl + 'register', newUser, {observe: 'response'});
  }
}
