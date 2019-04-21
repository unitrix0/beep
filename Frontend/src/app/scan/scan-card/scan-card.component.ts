import {Component, Input, OnInit} from '@angular/core';
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

  doScan = false;
  private timeoutProgress: number;

  constructor() {
  }

  ngOnInit() {
  }

  startScan() {
    this.doScan = true;
    const subscription = interval(100).subscribe(
      value => {
        this.timeoutProgress = value + 1;
      },
      error => console.log('Err: ' + error));

    setTimeout(() => {
      subscription.unsubscribe();
      setTimeout(() => {
        this.doScan = false;
        this.timeoutProgress = 0;
      }, 1000);
    }, 10000);
  }
}
