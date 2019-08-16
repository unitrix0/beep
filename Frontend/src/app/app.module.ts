import {HttpClientModule} from '@angular/common/http';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {ZXingScannerModule} from '@zxing/ngx-scanner';
import {BsDropdownModule} from 'ngx-bootstrap';

import {AuthService} from './_services/authService';
import {AppComponent} from './app.component';
import {appRoutes} from './routes';
import {NavComponent} from './nav/nav.component';
import {ScanComponent} from './scan/scan.component';
import {ScanCardComponent} from './scan/scan-card/scan-card.component';
import {ArticlesComponent} from './articles/articles.component';
import {ArticleEditComponent} from './articles/article-edit/article-edit.component';
import {ArticleCardComponent} from './articles/article-card/article-card.component';
import {ShoppingListComponent} from './shopping-list/shopping-list.component';
import {TimersComponent} from './timers/timers.component';
import {ArticlesResolver} from './_resolvers/articles.resolver';
import {EditUserResolver} from './_resolvers/edit-user.resolver';
import {DataService} from './_services/data.service';
import {UserComponent} from './user/user.component';
import {JwtModule} from '@auth0/angular-jwt';
import { RegistrationComponent } from './registration/registration.component';
import { HomeComponent } from './home/home.component';

export function jwtGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    ScanComponent,
    ScanCardComponent,
    ArticleEditComponent,
    ArticlesComponent,
    ArticleCardComponent,
    ShoppingListComponent,
    TimersComponent,
    UserComponent,
    RegistrationComponent,
    HomeComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: jwtGetter,
        whitelistedDomains: ['localhost:5000'],
        blacklistedRoutes: ['localhost:5000/api/auth']
      }
    }),
    FormsModule,
    BsDatepickerModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    BsDropdownModule.forRoot(),
    ZXingScannerModule
  ],
  providers: [
    AuthService,
    DataService,
    ArticlesResolver,
    EditUserResolver
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
