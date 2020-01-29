import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Options} from 'ng5-slider';

@Component({
  selector: 'app-article-open',
  templateUrl: './article-open.component.html',
  styleUrls: ['./article-open.component.css']
})
export class ArticleOpenComponent implements OnInit {
  @Input() remaining: number;
  @Output() remainingChange = new EventEmitter();
  private ticks: number[] = [0.25, 0.3, 0.5, 0.6, 0.75];
  private tickLabels: { [val: number]: string } = {0.25: '1/4', 0.3: '1/3', 0.5: '1/2', 0.6: '2/3', 0.75: '3/4'};
  private options: Options = {
    floor: 0,
    ceil: 1,
    step: 0.05,
    showTicks: true,
    stepsArray: this.ticks.map((tick: number) => {
      return {value: tick};
    }),
    translate: value => {
      return this.tickLabels[value];
    }
  };

  constructor() {
  }

  ngOnInit() {
    console.log(this.remaining);
  }
}
