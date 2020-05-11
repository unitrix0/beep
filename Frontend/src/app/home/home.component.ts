import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../_services/auth.service';
import {Router} from '@angular/router';
import {AlertifyService} from '../_services/alertify.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('description', {static: true}) description: ElementRef;
  @ViewChild('top', {static: true}) pageTop: ElementRef;
  showRegForm = false;

  constructor(private authService: AuthService, private router: Router, private alertify: AlertifyService) {
  }

  ngOnInit() {
    if (this.authService.loggedIn()) {
      this.router.navigate(['scan']);
    }
  }


  hideRegistrationForm() {
    this.showRegForm = false;
  }

  scrollToDescription() {
    const elem = this.description.nativeElement;
    elem.scrollIntoView({behavior: 'smooth'});
  }

  showRegistrationForm() {
    const elem = this.pageTop.nativeElement;
    elem.scrollIntoView({behavior: 'smooth'});
    this.showRegForm = true;
  }

  createDemoLogin() {
    this.authService.demoLogin().subscribe(value => {
      this.alertify.success('Anmeldung erfolgreich!');
      this.router.navigate(['scan']).catch(reason => {
        console.log('Navigation failed: ' + reason);
      });
    }, error => {
      console.log(error);
      this.alertify.error('Wir bitten vielmals um Entschuldigung. Es konnte leider kein Demo User angelegt werden. ' +
        'Wir kümmern uns so schnell wie möglich darum.');
    });
  }
}
