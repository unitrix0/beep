import {InvitationListItem} from './invitationListItem';

export interface UserInvitations {
  sentInvitations: InvitationListItem[];
  receivedInvitations: InvitationListItem[];
}
