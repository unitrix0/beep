import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {UsersService} from '../_services/users.service';
import {ResetScanService} from '../_services/reset-scan.service';
import {CodeScannerComponent} from './code-scanner/code-scanner.component';
import {AlertifyService} from '../_services/alertify.service';
import {AuthService} from '../_services/auth.service';
import {PermissionsService} from '../_services/permissions.service';
import {ArticlesService} from '../_services/articles.service';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.css']
})
export class ScanComponent implements OnInit {
  @ViewChild(CodeScannerComponent) scanner: CodeScannerComponent;

  scanMode = 'none';
  hasPermission: boolean;

  constructor(private usrService: UsersService, private articles: ArticlesService, private auth: AuthService,
              private resetScan: ResetScanService, private changeDetector: ChangeDetectorRef, private alertify: AlertifyService,
              private permissions: PermissionsService) {
  }

  ngOnInit() {
    this.usrService.updateInvitationsCount(this.auth.decodedToken.nameid);
    this.hasPermission = this.permissions.hasPermissionOr(this.permissions.flags.canScan, this.permissions.flags.isOwner);
  }


  startScan(newMode: string) {
    this.scanMode = newMode;
    this.changeDetector.detectChanges(); // Damit ViwChild referenz funktioniert
    console.log('start Scanning: ' + newMode);
    this.scanner.startScan();
  }

  scanTimeout() {
    console.log('scan timeout');
    this.scanner.stopScan();
    this.scanMode = 'none';
  }

  barcodeDetected(result: string) {
    console.log(this.auth.decodedToken);
    this.articles.lookupArticle(result, this.auth.decodedToken.environment_id)
      .subscribe(value => {
        console.log(value);
      }, error => {
        this.alertify.error('Artikel konnte nicht abgefragt werden: ' + error.message);
      });
    // 1. Stop scan
    // 2. lookup barcode in DB
    // 3.
    this.resetScanTimeout();
  }

  resetScanTimeout() {
    this.resetScan.reset.emit(this.scanMode);
  }
}
