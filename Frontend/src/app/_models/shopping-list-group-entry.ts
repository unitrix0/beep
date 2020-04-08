export interface ShoppingListGroupEntry {
  id: number;
  done: boolean;
  groupName: string;
  environmentId: number;
  keepStockAmount: number;
  onStock: number;
  needed: number;
}
