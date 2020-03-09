import {Component, Input, OnInit} from '@angular/core';
import {ActivityLogEntry} from '../../_models/activity-log-entry';
import {ScanModes} from '../../_enums/scan-modes.enum';
import {ArticlesService} from '../../_services/articles.service';

@Component({
  selector: 'app-activity-log',
  templateUrl: './activity-log.component.html',
  styleUrls: ['./activity-log.component.css']
})
export class ActivityLogComponent implements OnInit {
  @Input() scanMode: ScanModes;
  logEntries: ActivityLogEntry[];
  scanModes = ScanModes;

  constructor(private articleService: ArticlesService) {
  }

  ngOnInit() {
  }

  public refresh(environmentId: number) {
    this.articleService.getActivityLog(environmentId)
      .subscribe(entries => {
        this.logEntries = entries;
      }, error => {
        console.log('Error loading activity log: ' + error);
      });
  }
}
