import {Component, OnInit} from '@angular/core';
import {interval} from 'rxjs';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.css']
})
export class ScanComponent implements OnInit {
  scanMode = 'none';
  timeoutProgress = 0;

  constructor() {
  }

  ngOnInit() {
  }


}
