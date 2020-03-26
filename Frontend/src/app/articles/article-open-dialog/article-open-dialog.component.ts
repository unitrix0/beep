import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-article-open-dialog',
  templateUrl: './article-open-dialog.component.html',
  styleUrls: ['./article-open-dialog.component.css']
})
export class ArticleOpenDialogComponent implements OnInit {
  @Output() okClicked = new EventEmitter<number>();
  remaining: number;

  constructor(public modalRef: BsModalRef) {
  }

  ngOnInit() {
  }

  Ok() {
    this.okClicked.emit(this.remaining);
  }
}
