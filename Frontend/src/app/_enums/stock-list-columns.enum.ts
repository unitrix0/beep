export enum StockListColumns {
  all,
  amount = 1 << 0,      // 1
  expireDate = 1 << 1, // 2
  fillLevel = 1 << 2, // 4
  isOpened = 1 << 3, // 8
  checkOut = 1 << 4, // 16
}
