export interface ShoppingListArticleEntry {
  done: boolean;
  barcode: string;
  articleName: string;
  imageUrl: string;
  unitAbbreviation: string;
  keepStockAmount: number;
  onStock: number;
  opened: number;
  needed: number;
  amountRemaining: number;
}
