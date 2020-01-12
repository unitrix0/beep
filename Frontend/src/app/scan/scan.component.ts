import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {UsersService} from '../_services/users.service';
import {ResetScanService} from '../_services/reset-scan.service';
import {CodeScannerComponent} from './code-scanner/code-scanner.component';
import {AlertifyService} from '../_services/alertify.service';
import {AuthService} from '../_services/auth.service';
import {PermissionsService} from '../_services/permissions.service';
import {ArticlesService} from '../_services/articles.service';
import {ScanModes} from '../_enums/scan-modes.enum';
import {Article} from '../_models/article';
import {BsModalService} from 'ngx-bootstrap';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.css']
})
export class ScanComponent implements OnInit {
  @ViewChild(CodeScannerComponent) scanner: CodeScannerComponent;
  scanMode = ScanModes.none;
  scannedArticle: Article;
  private hasPermission: boolean;
  private scanModes = ScanModes;

  constructor(private usrService: UsersService, private articles: ArticlesService, private auth: AuthService,
              private resetScan: ResetScanService, private changeDetector: ChangeDetectorRef, private alertify: AlertifyService,
              private permissions: PermissionsService, private modalService: BsModalService) {
  }

  ngOnInit() {
    this.usrService.updateInvitationsCount(this.auth.decodedToken.nameid);
    this.hasPermission = this.permissions.hasPermissionOr(this.permissions.flags.canScan, this.permissions.flags.isOwner);
  }


  startScan(newMode: ScanModes) {
    this.scanMode = newMode;
    this.changeDetector.detectChanges(); // Damit ViwChild referenz funktioniert
    this.scanner.startScan();
  }


  barcodeDetected(barcode: string) {
    this.scanner.stopScan();
    switch (this.scanMode) {
      case ScanModes.checkin:
        this.articles.lookupArticle(barcode, this.auth.decodedToken.environment_id)
          .subscribe(article => {
            this.scannedArticle = article;
            if (this.scannedArticle.id === 0) {
              this.scannedArticle.barcode = barcode;
            }
            if (this.scannedArticle.articleUserSettings.id === 0) {
              this.scannedArticle.articleUserSettings.environmentId = this.auth.decodedToken.environment_id;
            }
          }, error => {
            this.alertify.error('Artikel konnte nicht abgefragt werden: ' + error.message);
          });
        break;
      case ScanModes.checkout:
        break;
      case ScanModes.open:
        break;
    }
    this.resetScanTimeout();
  }

  resetScanTimeout() {
    this.resetScan.reset.emit(this.scanMode);
  }

  newArticleCreated(newArticle: Article) {
    this.scannedArticle = newArticle;
  }

  finishScan() {
    this.scannedArticle = null;
    this.scanMode = this.scanModes.none;
  }
}
