import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {interval} from 'rxjs';

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
  @Output() scanStopped = new EventEmitter();

  doScan = false;
  private timeout = 10000;
  private timeoutProgress: number;

  constructor() {
  }

  ngOnInit() {
  }

  startScan() {
    if (!this.enabled) {
      return;
    }
    this.scanStarted.emit(this.modeName);
    this.doScan = true;
    const subscription = interval(100).subscribe(
      value => {
        const v = 100 / this.timeout * value;
        this.timeoutProgress = v * 100;
      },
      error => console.log('Err: ' + error));

    setTimeout(() => {
      subscription.unsubscribe();
      // Hide progress bar
      setTimeout(() => {
        this.scanStopped.emit();
        this.doScan = false;
        this.timeoutProgress = 0;
      }, 1000);
    }, this.timeout);
  }
}
