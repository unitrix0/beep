import {BeepEnvironment} from './beep-environment';

export interface User {
  id: number;
  displayName: string;
  username: string;
  environments: BeepEnvironment[];
}
