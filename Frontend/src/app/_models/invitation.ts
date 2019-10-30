export interface Invitation {
  inviteeId: number;
  invitee: string;
  inviter: string;
  environmentName: string;
  environmentId: number;
  issuedAt: Date;
  isAnswered: boolean;
}
