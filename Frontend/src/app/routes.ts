import {Routes} from '@angular/router';
import {ScanComponent} from './scan/scan.component';
import {ArticlesComponent} from './articles/articles.component';
import {ShoppingListComponent} from './shopping-list/shopping-list.component';
import {TimersComponent} from './timers/timers.component';

export const appRoutes: Routes = [
  {path: '', component: ScanComponent},
  {path: 'articles', component: ArticlesComponent},
  {path: 'shopping-list', component: ShoppingListComponent},
  {path: 'timers', component: TimersComponent},
];
