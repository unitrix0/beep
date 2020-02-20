import {ScanModes} from '../_enums/scan-modes.enum';

export interface ActivityLogEntry {
  action: ScanModes;
  actionDate: Date;
  imgUrl: string;
  description: string;
  username: string;
  amount: string;
}
