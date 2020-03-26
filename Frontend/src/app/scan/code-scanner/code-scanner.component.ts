import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ZXingScannerComponent} from '@zxing/ngx-scanner';
import {SettingsService} from '../../_services/settings.service';
import {AlertifyService} from '../../_services/alertify.service';
import {SelectCameraDialogComponent} from '../select-camera-dialog/select-camera-dialog.component';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-code-scanner',
  templateUrl: './code-scanner.component.html',
  styleUrls: ['./code-scanner.component.css']
})
export class CodeScannerComponent implements OnInit {
  @Output() barcodeDetected = new EventEmitter<string>();
  @Output() cancel = new EventEmitter();
  @ViewChild(ZXingScannerComponent, {static: true}) scanner: ZXingScannerComponent;
  private beep;
  private lastCode: string;

  constructor(private settings: SettingsService, private modalService: BsModalService, private alertify: AlertifyService) {
    this.beep = new Audio();
    this.beep.src = '../../../assets/Beep.mp3';
    this.beep.load();
    this.beep.volume = 0.1; // TODO Settings
  }

  ngOnInit() {
  }

  startScan() {
    if (this.settings.cameraDeviceId !== '') {
      this.scanner.askForPermission().then(permitted => {
        if (permitted) {
          this.scanner.updateVideoInputDevices().then(devices => {
            const dev = devices.find(d => d.deviceId === this.settings.cameraDeviceId);
            this.openCamStream(dev);
          }).catch(reason => {
            this.alertify.error('Es konnten keine Kameras gefunden werden ' + reason);
          });
        }
      });
    } else {
      this.selectCamera();
    }
  }

  stopScan() {
    this.scanner.enable = false;
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

  showSelectCamDlg(devices: MediaDeviceInfo[]) {
    const modalRef = this.modalService.show(SelectCameraDialogComponent, {
      ignoreBackdropClick: true,
      initialState: {
        cameras: devices,
        selectedCamera: this.settings.cameraDeviceId
      }
    });

    modalRef.content.okClicked.subscribe((selectedCam: MediaDeviceInfo) => this.selectCamDlg_ok(selectedCam, modalRef));
  }

  private selectCamDlg_ok(cam: MediaDeviceInfo, modalRef: BsModalRef) {
    this.settings.saveSelectedCam(cam)
      .subscribe(value => {
        this.alertify.success('Einstellung gespeichert');
        modalRef.hide();
      }, error => {
        this.alertify.error('Einstellung konnte nicht gespeichert werden: ' + error.message);
      });

  }

  private openCamStream(dev: MediaDeviceInfo) {
    this.scanner.device = dev;
    this.scanner.askForPermission().then(result => {
      if (result) {
        this.scanner.enable = true;
      } else {
        this.alertify.error('Kein Zugriff auf die Kamera');
      }
    });
  }

  private selectCamera() {
    this.scanner.askForPermission().then(result => {
      if (result) {
        this.scanner.updateVideoInputDevices().then(devices => {
          this.cancel.emit();
          this.showSelectCamDlg(devices);
        });
      }
    }).catch(reason => {
      this.alertify.error('Es konnte nicht auf die Kamera zugegriffen werden: ' + reason.message);
    });
  }
}
