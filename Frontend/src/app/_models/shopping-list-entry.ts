import {ShoppingListArticleEntry} from './shopping-list-article-entry';

export interface ShoppingListEntry {
  storeName: string;
  articles: ShoppingListArticleEntry[];
}
