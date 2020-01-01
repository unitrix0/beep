import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-article-image',
  templateUrl: './article-image.component.html',
  styleUrls: ['./article-image.component.css']
})
export class ArticleImageComponent implements OnInit {
  @Input() imageUrl: string;

  constructor() { }

  ngOnInit() {
  }

}
