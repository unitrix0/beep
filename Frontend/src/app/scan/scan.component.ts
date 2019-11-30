import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DataService} from '../_services/data.service';
import {ResetScanService} from '../_services/reset-scan.service';
import {CodeScannerComponent} from './code-scanner/code-scanner.component';
import {CheckInComponent} from './check-in/check-in.component';
import {BeepEnvironment} from '../_models/beep-environment';
import {AlertifyService} from '../_services/alertify.service';
import {PermissionFlags} from '../_enums/permission-flags.enum';
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
  private environments: BeepEnvironment[];
  activeEnvironment: string;

  constructor(private data: DataService, private auth: AuthService, private resetScan: ResetScanService,
              private changeDetector: ChangeDetectorRef, private alertify: AlertifyService, private permissions: PermissionsService) {
  }

  ngOnInit() {
    this.data.updateInvitationsCount(this.auth.decodedToken.nameid);
    this.data.getEnvironments(this.auth.decodedToken.nameid)
      .subscribe(value => {
        this.environments = value;
        this.activeEnvironment = this.environments.find(e => e.id.toString() === this.auth.decodedToken.environment_id).name;
      }, error => {
        this.alertify.error('Liste der Umgebungen konnte nicht abgefragt werden: ' + error.message);
      });
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

  changeEnvironment(newEnvironmentId: number) {
    this.auth.updatePermissionClaims(newEnvironmentId)
      .subscribe(value => {
        this.activeEnvironment = this.environments.find(e => e.id === newEnvironmentId).name;
      }, error => {
        this.alertify.error('Die Umgebung konnte nicht gewechselt werden: ' + error.mesage);
      });
  }
}
