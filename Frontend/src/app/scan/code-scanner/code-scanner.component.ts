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
  }

  startScan() {
    this.scanner.askForPermission().then(value => {
      console.log('Permissions response: ' + value);
      this.scanner.updateVideoInputDevices().then(value1 => {
        this.scanner.device = value1[1]; // TODO Device aus settings
      });
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
