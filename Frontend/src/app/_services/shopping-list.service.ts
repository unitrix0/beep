import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {ShoppingListEntry} from '../_models/shopping-list-entry';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  private baseUrl = environment.apiUrl + 'ShoppingList/';

  constructor(private http: HttpClient) {
  }

  getShoppingList(environmentId: number): Observable<ShoppingListEntry[]> {
    return this.http.get<ShoppingListEntry[]>(this.baseUrl + 'GetShoppingList/' + environmentId);
  }
}
