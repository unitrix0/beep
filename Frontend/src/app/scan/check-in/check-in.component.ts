import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-check-in',
  templateUrl: './check-in.component.html',
  styleUrls: ['./check-in.component.css']
})
export class CheckInComponent implements OnInit {
  @Input() code: string;

  constructor() { }

  ngOnInit() {
    this.code = 'Halten Sie den Strich-Code in die Kamera...';
  }

}
