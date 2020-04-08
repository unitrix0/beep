import {ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {UsersService} from '../_services/users.service';
import {ResetScanService} from '../_services/reset-scan.service';
import {CodeScannerComponent} from './code-scanner/code-scanner.component';
import {AlertifyService} from '../_services/alertify.service';
import {AuthService} from '../_services/auth.service';
import {PermissionsService} from '../_services/permissions.service';
import {ArticlesService} from '../_services/articles.service';
import {ScanModes} from '../_enums/scan-modes.enum';
import {Article} from '../_models/article';
import {ScanCardComponent} from './scan-card/scan-card.component';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {ActivityLogComponent} from './activity-log/activity-log.component';
import {ArticleUserSettings} from '../_models/articleUserSettings';
import {ArticleGroup} from '../_models/article-group';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.css']
})
export class ScanComponent implements OnInit {
  @ViewChild(CodeScannerComponent) scanner: CodeScannerComponent;
  @ViewChild('scanCheckIn', {static: true}) scanCheckIn: ScanCardComponent;
  @ViewChild('scanCheckOut', {static: true}) scanCheckOut: ScanCardComponent;
  @ViewChild('scanOpen', {static: true}) scanOpen: ScanCardComponent;
  @ViewChild('notFoundDlg', {static: true}) notFoundDialog: TemplateRef<any>;
  @ViewChild(ActivityLogComponent, {static: true}) activityLog: ActivityLogComponent;
  scanMode = ScanModes.none;
  scanModes = ScanModes;
  hasPermission: boolean;
  showScanner: boolean;
  private scannedArticle: Article;
  private articleUserSettings: ArticleUserSettings;
  private modalRef: BsModalRef;
  private showCheckIn = false;
  private showBaseData = false;
  private showCheckOut = false;

  constructor(private usrService: UsersService, private articles: ArticlesService, private auth: AuthService,
              private resetScan: ResetScanService, private changeDetector: ChangeDetectorRef, private alertify: AlertifyService,
              private permissions: PermissionsService, private modalService: BsModalService) {
  }

  ngOnInit() {
    this.usrService.updateInvitationsCount(this.auth.decodedToken.nameid);
    this.activityLog.refresh(this.permissions.token.environment_id);
    this.hasPermission = this.permissions.hasPermissionOr(this.permissions.flags.canScan, this.permissions.flags.isOwner);
  }

  environmentChanged() {
    this.activityLog.refresh(this.permissions.token.environment_id);
  }

  startScan(newMode: ScanModes) {
    this.showScanner = true;
    this.scanMode = newMode;
    this.changeDetector.detectChanges(); // Damit ViwChild referenz für 'scanner' funktioniert
    this.scanner.startScan();
  }

  finishScan() {
    this.scanCheckIn.doScan = false;
    this.scanCheckOut.doScan = false;
    this.scanOpen.doScan = false;
    this.scannedArticle = null;
    this.articleUserSettings = null;
    this.scanMode = this.scanModes.none;
    this.showCheckIn = false;
    this.showCheckOut = false;
    this.showBaseData = false;
    this.activityLog.refresh(this.permissions.token.environment_id);
  }

  private barcodeDetected(barcode: string) {
    this.scanner.stopScan();
    this.showScanner = false;
    this.lookupArticle(barcode);
    this.resetScanTimeout();
  }

  private resetScanTimeout() {
    this.resetScan.reset.emit(this.scanMode);
  }

  private showNotFoundDialog() {
    this.modalRef = this.modalService.show(this.notFoundDialog);
  }

  private lookupArticle(barcode: string) {
    this.articles.lookupArticle(barcode)
      .subscribe(article => {
        this.scannedArticle = article;
        if ((this.scanMode === ScanModes.checkout || this.scanMode === ScanModes.open) && this.scannedArticle.id === 0) {
          this.showNotFoundDialog();
          this.finishScan();
          return;
        }

        if (this.scannedArticle.id === 0) {
          this.scannedArticle.barcode = barcode;
          this.showBaseData = true;
          this.articleUserSettings = new class implements ArticleUserSettings {
            articleGroupId: number;
            articleGroup: ArticleGroup = new class implements ArticleGroup {
              id: number;
              keepStockAmount: number;
              name: string;
            };
            articleId: number;
            environmentId: number;
            id: number;
            keepStockAmount: number;
          };
        } else {
          this.lookupArticleUserSettings(this.scannedArticle.id, this.permissions.token.environment_id);
        }
      }, error => {
        this.alertify.error('Artikel konnte nicht abgefragt werden: ' + error);
      });
  }

  private lookupArticleUserSettings(articleId: number, environmentId: number) {
    this.articles.getArticleUserSettings(articleId, environmentId)
      .subscribe(response => {
        this.articleUserSettings = response;
        if (this.articleUserSettings.id === 0) {
          this.showBaseData = true;
        } else {
          this.showCheckIn = this.scanMode === ScanModes.checkin;
          this.showCheckOut = this.scanMode === ScanModes.open || this.scanMode === ScanModes.checkout;
        }
      }, error => {
        this.alertify.error('Datenabfrage fehlgeschlagen: ' + error);
      });
  }

  private save() {
    if (this.scannedArticle.id === 0) {
      this.saveArticleAndUserSettings();
      return;
    }
    this.saveArticleUserSettings();
  }

  private saveArticleAndUserSettings() {
    this.articles.createArticle(this.scannedArticle)
      .subscribe(createdArticle => {
        this.scannedArticle = createdArticle;
        this.saveArticleUserSettings();
      }, error => {
        this.alertify.error('Artikel konnte nicht angelegt werden: ' + error);
      });
  }

  private saveArticleUserSettings() {
    this.articleUserSettings.environmentId = this.permissions.token.environment_id;
    this.articleUserSettings.articleId = this.scannedArticle.id;
    this.articles.createArticleUserSettings(this.articleUserSettings)
      .subscribe(response => {
        this.articleUserSettings = response;
        this.showBaseData = false;
        this.showCheckIn = true;
        this.alertify.success('Artikel gespeichert');
      }, error => {
        this.alertify.error('Artikel konnte nicht angelegt werden: ' + error);
      });
  }
}
