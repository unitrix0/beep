import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ZXingScannerComponent} from '@zxing/ngx-scanner';

@Component({
  selector: 'app-code-scanner',
  templateUrl: './code-scanner.component.html',
  styleUrls: ['./code-scanner.component.css']
})
export class CodeScannerComponent implements OnInit {
  @Output() barcodeDetected = new EventEmitter<string>();
  @ViewChild(ZXingScannerComponent)
  scanner: ZXingScannerComponent;

  private lastCode: string;

  constructor() {
  }

  ngOnInit() {
    this.scanner.updateVideoInputDevices().then(value => {
      console.log(value);
    });
  }

  startScan() {
    this.scanner.updateVideoInputDevices().then(value1 => {
      this.scanner.device = value1[2]; // TODO Device aus settings
    });
    this.scanner.askForPermission().then(value => {
      console.log('Permissions response: ' + value);
    });
  }

  private scanSuccess(newCode: string) {
    if (this.lastCode === newCode) {
      return;
    }
    this.lastCode = newCode;
    this.barcodeDetected.emit(newCode);
  }
}
