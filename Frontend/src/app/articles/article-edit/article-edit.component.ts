import { Component, OnInit } from '@angular/core';
import {BsLocaleService, defineLocale, deLocale} from 'ngx-bootstrap';
defineLocale('de', deLocale);

@Component({
  selector: 'app-article-edit',
  templateUrl: './article-edit.component.html',
  styleUrls: ['./article-edit.component.css']
})
export class ArticleEditComponent implements OnInit {

  constructor(private localeService: BsLocaleService) { }

  ngOnInit() {
    this.localeService.use('de');
  }

}
