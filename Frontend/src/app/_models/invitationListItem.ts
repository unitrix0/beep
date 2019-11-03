export interface InvitationListItem {
  inviteeId: number;
  invitee: string;
  inviter: string;
  environmentName: string;
  environmentId: number;
  issuedAt: Date;
  isAnswered: boolean;
}
