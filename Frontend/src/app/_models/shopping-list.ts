import {ShoppingListEntry} from './shopping-list-entry';
import {ShoppingListGroupEntry} from './shopping-list-group-entry';

export interface ShoppingList {
  articleEntries: ShoppingListEntry[];
  groupEntries: ShoppingListGroupEntry[];
}
