import {Component, OnInit, ViewChild} from '@angular/core';
import {forEach} from '@angular/router/src/utils/collection';
import {log} from 'util';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.css']
})
export class ScanComponent implements OnInit {
  scanMode = 'none';
  code: string;

  constructor() {
  }

  ngOnInit() {
  }


  startScan(newMode: string) {
    this.scanMode = newMode;
    console.log('start Scanning: ' + newMode);
  }

  scanDone() {
    this.scanMode = 'none';
    console.log('scan timeout');
  }

  barcodeValueChanges(result) {
    console.log(result.codeResult.code);
  }

  cams(cams: MediaDeviceInfo[]) {
    for (let cam of cams) {
      console.log(cam.label);
    }
  }

  scanFail(error: void) {
    console.log(error);
  }

  success(result: string) {
    this.code = result;
  }
}
