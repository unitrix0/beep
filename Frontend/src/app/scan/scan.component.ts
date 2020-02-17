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
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {SettingsService} from '../_services/settings.service';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.css']
})
export class ScanComponent implements OnInit {
  @ViewChild(CodeScannerComponent) scanner: CodeScannerComponent;
  @ViewChild('scanCheckIn') scanCheckIn: ScanCardComponent;
  @ViewChild('scanCheckOut') scanCheckOut: ScanCardComponent;
  @ViewChild('scanOpen') scanOpen: ScanCardComponent;
  @ViewChild('notFoundDlg') notFoundDialog: TemplateRef<any>;
  scanMode = ScanModes.none;
  private scannedArticle: Article;
  private articleUserSettings: ArticleUserSettings;
  private hasPermission: boolean;
  private scanModes = ScanModes;
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
    this.hasPermission = this.permissions.hasPermissionOr(this.permissions.flags.canScan, this.permissions.flags.isOwner);
  }

  private startScan(newMode: ScanModes) {
    this.scanMode = newMode;
    this.changeDetector.detectChanges(); // Damit ViwChild referenz für 'scanner' funktioniert
    this.scanner.startScan();
  }

  private barcodeDetected(barcode: string) {
    this.scanner.stopScan();
    this.lookupArticle(barcode);
    this.resetScanTimeout();
  }

  private resetScanTimeout() {
    this.resetScan.reset.emit(this.scanMode);
  }

  private finishScan() {
    this.scanCheckIn.doScan = false;
    this.scanCheckOut.doScan = false;
    this.scanOpen.doScan = false;
    this.scannedArticle = null;
    this.articleUserSettings = null;
    this.scanMode = this.scanModes.none;
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
            articleId: number;
            environmentId: number;
            id: number;
            keepStockAmount: number;
            keepStockMode: number;
          };
        } else {
          this.lookupArticleUserSettings(this.scannedArticle.id, this.permissions.permissionToken.environment_id);
        }
      }, error => {
        this.alertify.error('Artikel konnte nicht abgefragt werden: ' + error.message);
      });
  }

  private lookupArticleUserSettings(articleId: number, environmentId: number) {
    this.articles.getArticleUserSettings(articleId, environmentId)
      .subscribe(articleUsrSettings => {
        this.articleUserSettings = articleUsrSettings;
        if (this.articleUserSettings.id === 0) {
          this.articleUserSettings.environmentId = this.permissions.permissionToken.environment_id;
          this.showBaseData = true;
        } else {
          this.showCheckIn = true;
        }
      }, error => {
        this.alertify.error('Datenabfrage fehlgeschlagen: ' + error.message);
      });
  }

  private save() {
    if (this.scannedArticle.id === 0) {
      this.saveArticle();
      return;
    }
    this.saveArticleUserSettings();
  }

  private saveArticle() {
    this.articles.createArticle(this.scannedArticle)
      .subscribe(createdArticle => {
        if (this.saveArticleUserSettings()) {
          this.scannedArticle = createdArticle;
          this.alertify.success('Artikel gespeichert');
        }
      }, error => {
        this.alertify.error('Artikel konnte nicht angelegt werden: ' + error.message);
      });
  }

  private saveArticleUserSettings(): boolean {
    this.articles.createArticleUserSettings(this.scannedArticle.id, this.articleUserSettings)
      .subscribe(value => {
        this.articleUserSettings = value;
        return true;
      }, error => {
        this.alertify.error('Artikel konnte nicht angelegt werden: ' + error.message);
        return false;
      });
    return false;
  }
}
