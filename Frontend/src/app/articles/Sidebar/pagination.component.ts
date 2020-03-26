import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Pagination} from '../../_models/pagination';
import {PageChangedEvent} from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {
  @Input() pagination: Pagination;
  @Output() pageChanged = new EventEmitter<PageChangedEvent>()

  constructor() {
  }

  ngOnInit() {
  }
}
