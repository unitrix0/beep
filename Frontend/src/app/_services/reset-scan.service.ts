import {EventEmitter, Injectable, Output} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ResetScanService {
  @Output() reset = new EventEmitter<string>();

  constructor() {
  }
}
