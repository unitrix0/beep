import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {DataService} from '../_services/data.service';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AlertifyService} from '../_services/alertify.service';
import {Invitation} from '../_models/invitation';
import {AuthService} from '../_services/authService';
import {UserInvitations} from '../_models/user-invitations';

@Injectable()
export class InvitationsResolver implements Resolve<UserInvitations> {

  constructor(private dataService: DataService, private auth: AuthService, private router: Router, private alertify: AlertifyService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<UserInvitations> {
    return this.dataService.getInvitations(this.auth.decodedToken.nameid).pipe(
      catchError(err => {
        this.alertify.error('Fehler beim Abfragen der Daten: ' + err.message);
        this.router.navigate(['/']);
        return of(null);
      })
    );
  }
}
