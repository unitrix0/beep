import {Component, EventEmitter, Input, OnInit, Output, TemplateRef} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';

@Component({
  selector: 'app-article-image',
  templateUrl: './article-image.component.html',
  styleUrls: ['./article-image.component.css']
})
export class ArticleImageComponent implements OnInit {
  @Input() imageUrl: string;
  @Output() imageUrlChange = new EventEmitter();

  private modalRef: BsModalRef;
  private urlCopy: string;

  constructor(private modalService: BsModalService) {
  }

  ngOnInit(): void {
  }

  openModal(template: TemplateRef<any>) {
    this.urlCopy = this.imageUrl;
    this.modalRef = this.modalService.show(template);
  }

  Ok() {
    this.imageUrlChange.emit(this.urlCopy);
    this.modalRef.hide();
  }

  cancel() {
    this.modalRef.hide();
  }
}
