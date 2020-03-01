import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../_services/auth.service';

@Component({
  selector: 'app-account-activation',
  templateUrl: './account-activation.component.html',
  styleUrls: ['./account-activation.component.css']
})
export class AccountActivationComponent implements OnInit {
  state: string;
  comment: string;

  constructor(private route: ActivatedRoute, private authService: AuthService) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(data => {
      const userId = data['id'];
      const email = data['email'];
      const token = data['token'];
      const isChange: boolean = data['isChange'];

      this.authService.confirmEmail(userId, email, token, isChange)
        .subscribe(value => {
          this.state = 'success';
          this.comment = isChange
            ? 'Bestätigung erfolgreich! Die E-Mail Adresse wurde geändert.'
            : 'Bestätigung erfolgreich! Sie können sich jetzt anmelden.';

        }, error => {
          this.state = 'error';
          this.comment = 'Fehler: ' + error;
        });
    });
  }
}
