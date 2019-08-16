import {Routes} from '@angular/router';
import {ScanComponent} from './scan/scan.component';
import {ArticlesComponent} from './articles/articles.component';
import {ShoppingListComponent} from './shopping-list/shopping-list.component';
import {TimersComponent} from './timers/timers.component';
import {UserComponent} from './user/user.component';
import {EditUserResolver} from './_resolvers/edit-user.resolver';
import {AuthGuard} from './_guards/auth.guard';
import {HomeComponent} from './home/home.component';

export const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      {path: 'scan', component: ScanComponent},
      {path: 'articles', component: ArticlesComponent},
      {path: 'shopping-list', component: ShoppingListComponent},
      {path: 'timers', component: TimersComponent},
      {path: 'users/:id', component: UserComponent, resolve: {user: EditUserResolver}}
    ]
  },
  {path: '**', redirectTo: '', pathMatch: 'full'}
];
