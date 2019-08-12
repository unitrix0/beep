import {Permission} from './permission';

export interface BeepEnvironment {
  id: number;
  name: string;
  permissions: Permission[];
}
