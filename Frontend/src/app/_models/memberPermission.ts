export interface MemberPermission {
  userId: number;
  username: string;

  isOwner: boolean;
  canScan: boolean;
  editArticleSettings: boolean;
  manageUsers: boolean;
}
