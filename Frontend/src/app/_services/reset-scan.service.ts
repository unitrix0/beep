import {EventEmitter, Injectable, Output} from '@angular/core';
import {ScanModes} from '../_enums/scan-modes.enum';

@Injectable({
  providedIn: 'root'
})
export class ResetScanService {
  @Output() reset = new EventEmitter<ScanModes>();

  constructor() {
  }
}
