export interface Article {
  id: number;
  unitId: number;
  imageUrl: string;
  name: string;
  barcode: string;
  typicalLifetime: number;
  hasLifetime: boolean;
  groupId: number;

  userSettings: ArticleUserSettings;
}
