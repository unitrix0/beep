import {Component, Input, OnInit} from '@angular/core';
import {Article} from '../../_models/article';

@Component({
  selector: 'app-article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.css']
})
export class ArticleCardComponent implements OnInit {
  @Input() article: Article;

  edit = true;

  constructor() {
  }

  ngOnInit() {
  }

  editArticleSettings() {
    this.edit = !this.edit;
  }
}
