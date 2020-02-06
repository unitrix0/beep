import {Routes} from '@angular/router';
import {ScanComponent} from './scan/scan.component';
import {ArticlesComponent} from './articles/articles.component';
import {ShoppingListComponent} from './shopping-list/shopping-list.component';
import {UserComponent} from './user/user.component';
import {EditUserResolver} from './_resolvers/edit-user.resolver';
import {AuthGuard} from './_guards/auth.guard';
import {HomeComponent} from './home/home.component';
import {InvitationsComponent} from './invitations/invitations.component';
import {InvitationsResolver} from './_resolvers/invitations.resolver';
import {ArticlesResolver} from './_resolvers/articles.resolver';

export const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      {path: 'scan', component: ScanComponent},
      {path: 'articles', component: ArticlesComponent, resolve: {articles: ArticlesResolver}},
      {path: 'shopping-list', component: ShoppingListComponent},
      {path: 'users/:id', component: UserComponent, resolve: {user: EditUserResolver}},
      {path: 'users/:id/invitations', component: InvitationsComponent, resolve: {invitations: InvitationsResolver}}
    ]
  },
  {path: '**', redirectTo: '', pathMatch: 'full'}
];
