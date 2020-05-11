export interface CheckIn {
  amountOnStock: number;
  expireDate: Date;
  usualLifetime: number;
  environmentId: string;
  barcode: string;
  articleId: number;
  clientTimezoneOffset: number;
}
