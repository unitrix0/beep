import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {User} from '../_models/user';
import {DataService} from '../_services/data.service';
import {catchError} from 'rxjs/operators';

@Injectable()
export class EditUserResolver implements Resolve<User> {

  constructor(private dataService: DataService, private route: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User> {
    return this.dataService.getUser(route.params['id']).pipe(
      catchError(err => {
        console.log('ERROR: ' + err);
        this.route.navigate(['/']);
        return of(null);
      })
    );
  }
}
