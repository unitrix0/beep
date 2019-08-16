import {BeepEnvironment} from './beep-environment';

export interface User {
  displayName: string;
  username: string;
  environments: BeepEnvironment[];
}
