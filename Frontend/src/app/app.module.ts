import {HttpClientModule} from '@angular/common/http';
import {BrowserModule} from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {ZXingScannerModule} from '@zxing/ngx-scanner';
import {BsDropdownModule, ModalModule, TabsModule} from 'ngx-bootstrap';

import {AuthService} from './_services/auth.service';
import {AppComponent} from './app.component';
import {appRoutes} from './routes';
import {NavComponent} from './nav/nav.component';
import {ScanComponent} from './scan/scan.component';
import {ScanCardComponent} from './scan/scan-card/scan-card.component';
import {ArticlesComponent} from './articles/articles.component';
import {ArticleEditComponent} from './articles/article-edit/article-edit.component';
import {ArticleCardComponent} from './articles/article-card/article-card.component';
import {ShoppingListComponent} from './shopping-list/shopping-list.component';
import {ArticlesResolver} from './_resolvers/articles.resolver';
import {EditUserResolver} from './_resolvers/edit-user.resolver';
import {DataService} from './_services/data.service';
import {UserComponent} from './user/user.component';
import {JwtModule} from '@auth0/angular-jwt';
import {RegistrationComponent} from './registration/registration.component';
import {HomeComponent} from './home/home.component';
import {InvitationsComponent} from './invitations/invitations.component';
import {InvitationsResolver} from './_resolvers/invitations.resolver';
import {registerLocaleData} from '@angular/common';
import localeCh from '@angular/common/locales/de-CH';
import {BoolYesNoPipe} from './_helpers/bool-yes-no.pipe';
import {InviteDialogComponent} from './user/invite-dialog/invite-dialog.component';
import {ValidateInvitationRecipientDirective} from './_helpers/validate-invitation-recipient.directive';
import {ResetScanService} from './_services/reset-scan.service';
import {CodeScannerComponent} from './scan/code-scanner/code-scanner.component';
import {CheckInComponent} from './scan/check-in/check-in.component';
import { ShowOnPermissionDirective } from './_directives/show-on-permission.directive';
import {PermissionsService} from './_services/permissions.service';
import { EnvironmentEditComponent } from './user/environment-edit/environment-edit.component';
import { ProfileComponent } from './user/profile/profile.component';


export function jwtGetter() {
  const token = localStorage.getItem('token');
  return token;
}

registerLocaleData(localeCh, 'de-CH');

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
    UserComponent,
    RegistrationComponent,
    HomeComponent,
    InvitationsComponent,
    BoolYesNoPipe,
    InviteDialogComponent,
    ValidateInvitationRecipientDirective,
    CodeScannerComponent,
    CheckInComponent,
    ShowOnPermissionDirective,
    EnvironmentEditComponent,
    ProfileComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: jwtGetter,
        whitelistedDomains: ['localhost:5000', 'localhost:5001'],
        blacklistedRoutes: ['localhost:5000/api/auth', 'localhost:5001/api/auth']
      }
    }),
    FormsModule,
    BsDatepickerModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    ZXingScannerModule
  ],
  providers: [
    {provide: LOCALE_ID, useValue: 'de-CH'},
    AuthService,
    DataService,
    ArticlesResolver,
    EditUserResolver,
    InvitationsResolver,
    ResetScanService,
    PermissionsService
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    InviteDialogComponent
  ]
})
export class AppModule {
}
