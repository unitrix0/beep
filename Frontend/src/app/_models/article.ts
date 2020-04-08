import {ArticleStore} from './article-store';

export interface Article {
  id: number;
  barcode: string;
  name: string;
  unitId: number;
  contentAmount: number;
  hasLifetime: boolean;
  imageUrl: string;
  totalStockAmount: number;
  stores: ArticleStore[];
}
