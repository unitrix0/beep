import {Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {ZXingScannerComponent} from '@zxing/ngx-scanner';
import {SettingsService} from '../../_services/settings.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';

@Component({
  selector: 'app-code-scanner',
  templateUrl: './code-scanner.component.html',
  styleUrls: ['./code-scanner.component.css']
})
export class CodeScannerComponent implements OnInit {
  @Output() barcodeDetected = new EventEmitter<string>();
  @Output() cancel = new EventEmitter();
  @ViewChild(ZXingScannerComponent) scanner: ZXingScannerComponent;
  @ViewChild('selectCamDlg') selectCamDlg: TemplateRef<any>;
  private beep;
  private lastCode: string;
  private modalRef: BsModalRef;
  private cameras: MediaDeviceInfo[];
  private selectedCam: string;

  constructor(private settings: SettingsService, private modalService: BsModalService) {
    this.beep = new Audio();
    this.beep.src = '../../../assets/Beep.mp3';
    this.beep.load();
    this.beep.volume = 0.1; // TODO Settings
  }

  ngOnInit() {
  }

  startScan() {
    this.scanner.updateVideoInputDevices().then(devices => {
      const cam = devices.find(d => d.deviceId === this.settings.cameraDeviceId);
      if (cam == null) {
        this.cameras = devices;
        this.VerifyCam();
        this.cancel.emit();
        return;
      }
      this.scanner.device = cam;
    });

    this.scanner.askForPermission().then(permission => {
      console.log('Permissions response: ' + permission);
    });
  }

  stopScan() {
    this.scanner.enable = false;
  }

  private VerifyCam() {
    this.modalRef = this.modalService.show(this.selectCamDlg, {ignoreBackdropClick: true});
  }

  scanSuccess(newCode: string) {
    if (this.lastCode === newCode) {
      return;
    }
    this.beep.play();
    console.log('new code: ' + newCode);
    this.lastCode = newCode;
    this.barcodeDetected.emit(newCode);
  }

  private selectCamDlg_ok() {
    const device = this.cameras.find(c => c.deviceId === this.selectedCam);
    this.settings.saveSelectedCam(device);
    this.modalRef.hide();
  }
}
