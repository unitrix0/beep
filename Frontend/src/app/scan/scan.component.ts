import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DataService} from '../_services/data.service';
import {AuthService} from '../_services/authService';
import {ResetScanService} from '../_services/reset-scan.service';
import {ZXingScannerComponent} from '@zxing/ngx-scanner';
import {ChangeDetection} from '@angular/cli/lib/config/schema';
import {CodeScannerComponent} from './code-scanner/code-scanner.component';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.css']
})
export class ScanComponent implements OnInit {
  @ViewChild(CodeScannerComponent)
  scanner: CodeScannerComponent;

  scanMode = 'none';
  code: string;

  constructor(private data: DataService, private auth: AuthService, private resetScan: ResetScanService,
              private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.code = 'Halten Sie den Strich-Code in die Kamera...';
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
    this.code = '';
    console.log('scan timeout');
  }

  success(result: string) {
    this.code = result;
    this.resetScanTimeout();
  }

  resetScanTimeout() {
    this.resetScan.reset.emit(this.scanMode);
  }
}
