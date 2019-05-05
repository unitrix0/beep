import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.css']
})
export class ScanComponent implements OnInit {
  scanMode = 'none';

  constructor() {
  }

  ngOnInit() {
  }


  startScan(newMode: string) {
    this.scanMode = newMode;
  }

  scanDone() {
    this.scanMode = 'none';
  }
}
