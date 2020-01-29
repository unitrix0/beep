export interface StockEntry {
  id: number;
  environmentId: number;
  amountOnStock: number;
  expireDate: Date;
  openedOn: Date;
  amountRemaining: number;
  isOpened: boolean;
  clientTimezoneOffset: number;
}
