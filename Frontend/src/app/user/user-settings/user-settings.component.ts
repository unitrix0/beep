import {Component, OnInit} from '@angular/core';
import {SettingsService} from '../../_services/settings.service';
import {ZXingScannerComponent} from '@zxing/ngx-scanner';
import {BsModalService} from 'ngx-bootstrap';
import {SelectCameraDialogComponent} from '../../scan/select-camera-dialog/select-camera-dialog.component';
import {AlertifyService} from '../../_services/alertify.service';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.css']
})
export class UserSettingsComponent implements OnInit {

  constructor(public settingsService: SettingsService, private modalService: BsModalService, private alertifyService: AlertifyService) {
  }

  ngOnInit(): void {
  }

  changeCamera() {
    const scanner: ZXingScannerComponent = new ZXingScannerComponent();
    scanner.askForPermission().then(permitted => {
      if (permitted) {
        scanner.updateVideoInputDevices().then(devices => {
          const modalRef = this.modalService.show(SelectCameraDialogComponent, {
            ignoreBackdropClick: true,
            initialState: {
              cameras: devices,
              selectedCamera: this.settingsService.cameraDeviceId
            }
          });

          modalRef.content.okClicked
            .subscribe((selectedCam: MediaDeviceInfo) => {
              this.settingsService.saveSelectedCam(selectedCam)
                .subscribe(value => {
                  modalRef.hide();
                  this.alertifyService.success('Einstellung gespeichert');
                }, error => {
                  this.alertifyService.error('Einstellung konnte nicht gespeichert werden: ' + error);
                });
            });
        });
      }
    });
  }
}
