import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {User} from '../_models/user';
import {UsersService} from '../_services/users.service';
import {catchError} from 'rxjs/operators';

@Injectable()
export class EditUserResolver implements Resolve<User> {

  constructor(private dataService: UsersService, private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User> {
    return this.dataService.getUser(route.params['id']).pipe(
      catchError(err => {
        console.log('ERROR: ' + err);
        this.router.navigate(['/']);
        return of(null);
      })
    );
  }
}
