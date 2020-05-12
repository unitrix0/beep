import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AuthService} from '../_services/auth.service';
import {Router} from '@angular/router';
import {AlertifyService} from '../_services/alertify.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('description', {static: true}) description: ElementRef;
  modalRef: BsModalRef;

  constructor(private authService: AuthService, private router: Router, private alertify: AlertifyService,
              private modalService: BsModalService) {
  }

  ngOnInit() {
    if (this.authService.loggedIn()) {
      this.router.navigate(['scan']);
    }
  }

  scrollToDescription() {
    const elem = this.description.nativeElement;
    elem.scrollIntoView({behavior: 'smooth'});
  }

  createDemoLogin(creatingDemoModal: TemplateRef<any>) {
    this.modalRef = this.modalService.show(creatingDemoModal);
      this.authService.demoLogin().subscribe(value => {
        this.modalRef.hide();
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
