import {Component, EventEmitter, Input, OnInit, Output, TemplateRef} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-article-image',
  templateUrl: './article-image.component.html',
  styleUrls: ['./article-image.component.css']
})
export class ArticleImageComponent implements OnInit {
  @Input() barcode: string;
  @Input() imageUrl: string;
  @Input() showBarcode = true;
  @Input() showChangeImageBtn = true;
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

  ok() {
    this.imageUrlChange.emit(this.urlCopy);
    this.modalRef.hide();
  }

  cancel() {
    this.modalRef.hide();
  }
}
