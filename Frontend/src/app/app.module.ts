import {HttpClientModule} from '@angular/common/http';
import {BrowserModule} from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {ZXingScannerModule} from '@zxing/ngx-scanner';
import {BsDropdownModule, ModalModule, PaginationModule, ProgressbarModule, TabsModule} from 'ngx-bootstrap';

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
import {UsersService} from './_services/users.service';
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
import {ShowOnPermissionDirective} from './_directives/show-on-permission.directive';
import {PermissionsService} from './_services/permissions.service';
import {EnvironmentEditComponent} from './user/environment-edit/environment-edit.component';
import {ProfileComponent} from './user/profile/profile.component';
import {NameOrBarcodeComponent} from './articles/Sidebar/name-or-barcode.component';
import {ArticleFilterComponent} from './articles/Sidebar/article-filter.component';
import {EnvironmentFilterComponent} from './articles/Sidebar/environment-filter.component';
import {EnvironmentSelectorComponent} from './environment-selector/environment-selector.component';
import {PaginationComponent} from './articles/Sidebar/pagination.component';
import {ArticleUserSettingsComponent} from './articles/article-user-settings/article-user-settings.component';
import {ArticleStockComponent} from './articles/article-stock/article-stock.component';
import {ArticlesService} from './_services/articles.service';
import {ArticleCheckinComponent} from './articles/article-checkin/article-checkin.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ArticleImageComponent} from './articles/article-image/article-image.component';
import {CheckOutDialogComponent} from './articles/check-out-dialog/check-out-dialog.component';
import {MinimumValueDirective} from './_directives/minimum-value.directive';
import {MaximumValueDirective} from './_directives/maximum-value.directive';
import { ArticleCheckOutComponent } from './articles/article-check-out/article-check-out.component';
import {FillLevelComponent} from './_helpers/fill-level.component';
import { StockEntryListComponent } from './articles/stock-entry-list/stock-entry-list.component';
import { ArticleOpenComponent } from './articles/article-open/article-open.component';
import {Ng5SliderModule} from 'ng5-slider';
import { ArticleOpenDialogComponent } from './articles/article-open-dialog/article-open-dialog.component';
import {RequiredSelectDirective} from './_directives/required-select.directive';
import {MatchFieldDirective} from './_directives/match-field.directive';

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
    ShowOnPermissionDirective,
    EnvironmentEditComponent,
    ProfileComponent,
    NameOrBarcodeComponent,
    ArticleFilterComponent,
    EnvironmentFilterComponent,
    EnvironmentSelectorComponent,
    PaginationComponent,
    ArticleUserSettingsComponent,
    ArticleStockComponent,
    ArticleCheckinComponent,
    ArticleImageComponent,
    CheckOutDialogComponent,
    MinimumValueDirective,
    MaximumValueDirective,
    ArticleCheckOutComponent,
    FillLevelComponent,
    FillLevelComponent,
    StockEntryListComponent,
    ArticleOpenComponent,
    ArticleOpenDialogComponent,
    RequiredSelectDirective,
    MatchFieldDirective
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: jwtGetter,
        whitelistedDomains: ['localhost:5000', 'localhost:5001'],
        blacklistedRoutes: ['localhost:5000/api/auth', 'localhost:5001/api/auth']
        // whitelistedDomains: ['drone02:5000', 'drone02:5001'],
        // blacklistedRoutes: ['drone02:5000/api/auth', 'drone02:5001/api/auth']
      }
    }),
    FormsModule,
    BsDatepickerModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    ZXingScannerModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    PaginationModule.forRoot(),
    ProgressbarModule.forRoot(),
    Ng5SliderModule
  ],
  providers: [
    {provide: LOCALE_ID, useValue: 'de-CH'},
    AuthService,
    UsersService,
    ArticlesResolver,
    EditUserResolver,
    InvitationsResolver,
    ResetScanService,
    PermissionsService,
    ArticlesService
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    InviteDialogComponent,
    CheckOutDialogComponent,
    ArticleOpenDialogComponent
  ]
})
export class AppModule {
}
