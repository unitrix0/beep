import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';

@Component({
  selector: 'app-select-camera-dialog',
  templateUrl: './select-camera-dialog.component.html',
  styleUrls: ['./select-camera-dialog.component.css']
})
export class SelectCameraDialogComponent implements OnInit {
  @Output() okClicked = new EventEmitter<MediaDeviceInfo>();
  cameras: MediaDeviceInfo[];
  selectedCam: string;

  constructor(public modalRef: BsModalRef) {
  }

  ngOnInit(): void {
  }

  selectCamDlg_ok() {
    const selected = this.cameras.find(c => c.deviceId === this.selectedCam);
    this.okClicked.emit(selected);
  }
}
