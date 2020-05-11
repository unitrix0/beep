import {ArticleGroup} from './article-group';

export interface ArticleUserSettings {
  id: number;
  environmentId: string;
  articleId: number;
  articleGroup: ArticleGroup;
  articleGroupId: number;
  keepStockAmount: number;
}
