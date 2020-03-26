import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../_services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('description', {static: true}) description: ElementRef;
  @ViewChild('top', {static: true}) pageTop: ElementRef;
  showRegForm = false;

  constructor(private authService: AuthService, private router: Router) {
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
}
