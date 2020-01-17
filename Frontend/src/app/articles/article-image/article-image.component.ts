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
  private urlBackup: string;

  constructor(private modalService: BsModalService) {
  }

  ngOnInit(): void {
  }

  openModal(template: TemplateRef<any>) {
    this.urlBackup = this.imageUrl;
    this.modalRef = this.modalService.show(template);
  }

  cancel() {
    this.imageUrl = this.urlBackup;
    this.modalRef.hide();
  }

  setChanged() {
    this.modalRef.hide();
    this.imageUrlChange.emit(this.imageUrl);
  }
}
