import {PaginatedResult} from './pagination';
import {StockEntry} from './stock.entry';

export class PagedStockList extends PaginatedResult<StockEntry[]> {
  totalStockAmount: number;
}
