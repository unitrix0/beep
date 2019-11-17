export enum PermissionFlags {
  none                = 0,      // 0
  removeMember        = 1 << 0, // 1
  invite              = 1 << 1, // 2
  editArticleSettings = 1 << 2, // 4
  checkOut            = 1 << 3, // 8
  checkIn             = 1 << 4, // 16
  canView             = 1 << 5, // 32
  isOwner             = 1 << 6, // 64
  invalid             = 1 << 7, // 128
}
