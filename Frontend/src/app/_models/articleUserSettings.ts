import {ArticleGroup} from './article-group';

export interface ArticleUserSettings {
  id: number;
  environmentId: number;
  articleId: number;
  articleGroup: ArticleGroup;
  articleGroupId: number;
  keepStockAmount: number;
}
