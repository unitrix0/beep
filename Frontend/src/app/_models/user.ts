import {BeepEnvironment} from './beep-environment';

export interface User {
  username: string;
  environments: BeepEnvironment[];
}
