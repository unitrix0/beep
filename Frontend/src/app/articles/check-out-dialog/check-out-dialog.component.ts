import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';

@Component({
  selector: 'app-check-out-dialog',
  templateUrl: './check-out-dialog.component.html',
  styleUrls: ['./check-out-dialog.component.css']
})
export class CheckOutDialogComponent implements OnInit {
  @Output() okClicked = new EventEmitter<number>();
  amount: number;
  totalAmount: number;

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
        if (this.amount > 1) {
          this.amount--;
        }
        break;
      case '+':
        if (this.amount < this.totalAmount) {
          this.amount++;
        }
        break;
    }
  }
}
