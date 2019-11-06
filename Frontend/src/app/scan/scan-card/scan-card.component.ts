import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ResetScanService} from '../../_services/reset-scan.service';
import {Timer} from '../../_helpers/timer';

@Component({
  selector: 'app-scan-card',
  templateUrl: './scan-card.component.html',
  styleUrls: ['./scan-card.component.css']
})
export class ScanCardComponent implements OnInit {
  @Input() icon: string;
  @Input() modeName: string;
  @Input() description: string;
  @Input() enabled: boolean;
  @Output() scanStarted = new EventEmitter<string>();
  @Output() scanTimedOut = new EventEmitter();

  doScan = false;
  private scanTimeout = 30;
  private timeoutCounter = 0;
  private timeoutProgress: number;
  private timer: Timer;

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
    this.scanStarted.emit(this.modeName);
    this.doScan = true;
    this.timer.start();
  }

  private SubscribeResetService() {
    this.resetService.reset.subscribe((scanMode: string) => {
      if (scanMode !== this.modeName) {
        return;
      }
      console.log(this.modeName + ' got reset');
      this.timer.stop();
      this.timeoutProgress = 0;
      this.timeoutCounter = 0;
      this.timer.start();
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
