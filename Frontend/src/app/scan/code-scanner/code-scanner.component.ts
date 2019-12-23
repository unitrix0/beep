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
  private beep;
  private suspended: boolean;

  constructor() {
    this.beep = new Audio();
    this.beep.src = '../../../assets/Beep.mp3';
    this.beep.load();
    this.beep.volume = 0.1; // TODO Settings
  }

  ngOnInit() {
  }

  startScan() {
    this.scanner.updateVideoInputDevices().then(value1 => {
      console.log(value1[0]);
      this.scanner.device = value1[0]; // TODO Device aus settings
    });
    this.scanner.askForPermission().then(value => {
      console.log('Permissions response: ' + value);
      if (value) {
        this.scanner.tryHarder = true;
      }
    });
  }

  stopScan() {
    this.scanner.device = null;
    this.scanner.reset();
  }

  private scanSuccess(newCode: string) {
    if (this.lastCode === newCode) {
      return;
    }
    this.beep.play();
    console.log('new code: ' + newCode);
    this.lastCode = newCode;
    this.barcodeDetected.emit(newCode);
  }
}
