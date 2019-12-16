import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-environment-filter',
  templateUrl: './environment-filter.component.html',
  styleUrls: ['./environment-filter.component.css']
})
export class EnvironmentFilterComponent implements OnInit {
  @Input() environmentId: number;
  @Output() environmentIdChange = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

}
