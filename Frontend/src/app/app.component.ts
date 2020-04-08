import {Component, OnInit} from '@angular/core';
import {AuthService} from './_services/auth.service';
import {PermissionsService} from './_services/permissions.service';
import {SettingsService} from './_services/settings.service';
import {ArticlesService} from './_services/articles.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private authService: AuthService, private permissions: PermissionsService, private settings: SettingsService,
              private articlesService: ArticlesService) {
  }

  ngOnInit(): void {
    this.authService.reloadToken();
    this.permissions.reloadToken();
    this.settings.reloadSettings();
    this.articlesService.reloadBaseData();
  }
}
