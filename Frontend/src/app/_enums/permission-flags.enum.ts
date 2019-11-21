export enum PermissionFlags {
  none                = 0,      // 0
  isOwner             = 1 << 0, // 1
  canScan             = 1 << 1, // 2
  editArticleSettings = 1 << 2, // 4
  manageUsers         = 1 << 3, // 8
}
