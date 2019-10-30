import {Invitation} from './invitation';

export interface UserInvitations {
  sentInvitations: Invitation[];
  receivedInvitations: Invitation[];
}
