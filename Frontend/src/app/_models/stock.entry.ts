export interface StockEntry {
  id: number;
  amountOnStock: number;
  expireDate: Date;
  amountRemaining: number;
  isOpened: boolean;
}
