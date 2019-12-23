export interface Article {
  id: number;
  barcode: string;
  name: string;
  groupId: number;
  hasLifetime: boolean;
  imageUrl: string;
  articleUserSettings: ArticleUserSettings;
}
