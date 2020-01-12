import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ResetScanService} from '../../_services/reset-scan.service';
import {Timer} from '../../_helpers/timer';
import {ScanModes} from '../../_enums/scan-modes.enum';

@Component({
  selector: 'app-scan-card',
  templateUrl: './scan-card.component.html',
  styleUrls: ['./scan-card.component.css']
})
export class ScanCardComponent implements OnInit {
  @Input() icon: string;
  @Input() mode: ScanModes;
  @Input() description: string;
  @Input() enabled: boolean;
  @Output() scanStarted = new EventEmitter<ScanModes>();
  @Output() scanTimedOut = new EventEmitter();

  doScan = false;
  private scanTimeout = 15;
  private timeoutCounter = 0;
  private timeoutProgress: number;
  private timer: Timer;
  private scanModes = ScanModes;

  constructor(private resetService: ResetScanService) {
  }

  ngOnInit() {
    this.RegisterTimerTick();
    this.SubscribeResetService();
  }

  startScan() {
    if (!this.enabled) {
      return;
    }
    this.scanStarted.emit(this.mode);
    this.doScan = true;
    // this.timer.start();
  }

  private SubscribeResetService() {
    this.resetService.reset.subscribe((scanMode: ScanModes) => {
      if (scanMode !== this.mode) {
        return;
      }
      console.log(this.scanModes[this.mode] + ' got reset');
      this.timer.stop();
      this.timeoutProgress = 0;
      this.timeoutCounter = 0;
      // this.timer.start();
    });
  }

  private RegisterTimerTick() {
    this.timer = new Timer(() => {
      const scanTimeout = this.scanTimeout * 10;
      this.timeoutProgress = 100 / scanTimeout * this.timeoutCounter;
      this.timeoutCounter++;

      if (this.timeoutCounter === scanTimeout) {
        this.timer.stop();

        // Hide progress bar
        setTimeout(() => {
          this.scanTimedOut.emit();
          this.doScan = false;
          this.timeoutProgress = 0;
          this.timeoutCounter = 0;
        }, 1000);
      }
    }, 100);
  }
}
