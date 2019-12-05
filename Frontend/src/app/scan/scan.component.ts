import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {UsersService} from '../_services/users.service';
import {ResetScanService} from '../_services/reset-scan.service';
import {CodeScannerComponent} from './code-scanner/code-scanner.component';
import {CheckInComponent} from './check-in/check-in.component';
import {BeepEnvironment} from '../_models/beep-environment';
import {AlertifyService} from '../_services/alertify.service';
import {AuthService} from '../_services/auth.service';
import {PermissionsService} from '../_services/permissions.service';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.css']
})
export class ScanComponent implements OnInit {
  @ViewChild(CodeScannerComponent) scanner: CodeScannerComponent;
  @ViewChild(CheckInComponent) checkIn: CheckInComponent;

  scanMode = 'none';

  constructor(private data: UsersService, private auth: AuthService, private resetScan: ResetScanService,
              private changeDetector: ChangeDetectorRef, private alertify: AlertifyService, private permissions: PermissionsService) {
  }

  ngOnInit() {
    this.data.updateInvitationsCount(this.auth.decodedToken.nameid);
  }


  startScan(newMode: string) {
    this.scanMode = newMode;
    this.changeDetector.detectChanges();
    console.log('start Scanning: ' + newMode);
    this.scanner.startScan();
  }

  scanTimeout() {
    this.scanMode = 'none';
    console.log('scan timeout');
  }

  barcodeDetected(result: string) {
    this.checkIn.code = result;
    this.resetScanTimeout();
  }

  resetScanTimeout() {
    this.resetScan.reset.emit(this.scanMode);
  }
}
