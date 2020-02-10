import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AuthService} from '../../_services/auth.service';

@Component({
  selector: 'app-environment-filter',
  templateUrl: './environment-filter.component.html',
  styleUrls: ['./environment-filter.component.css']
})
export class EnvironmentFilterComponent implements OnInit {
  @Output() changed = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

}
