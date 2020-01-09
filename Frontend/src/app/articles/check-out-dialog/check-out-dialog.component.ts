import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';
import {Form} from '@angular/forms';

@Component({
  selector: 'app-check-out-dialog',
  templateUrl: './check-out-dialog.component.html',
  styleUrls: ['./check-out-dialog.component.css']
})
export class CheckOutDialogComponent implements OnInit {
  @Output() okClicked = new EventEmitter<number>();
  amount: number;

  constructor(private modalRef: BsModalRef) {
  }

  ngOnInit() {
    this.amount = 0;
  }

  Ok() {
    this.okClicked.emit(this.amount);
  }

  adjustAmount(s: string) {
    switch (s) {
      case '-':
        this.amount--;
        break;
      case '+':
        this.amount++;
        break;
    }
  }
}
