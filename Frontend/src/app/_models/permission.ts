export interface Permission {
  userId: number;
  username: string;

  isOwner: boolean;
  canView: boolean;
  checkIn: boolean;
  checkOut: boolean;
  editArticleSettings: boolean;
  invite: boolean;
  removeMember: boolean;
}
