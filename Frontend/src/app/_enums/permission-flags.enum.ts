export enum PermissionFlags {
  None = 0, // 0
  RemoveMember = 1 << 0, // 1
  Invite = 1 << 1, // 2
  EditArticleSettings = 1 << 2, // 4
  CheckOut = 1 << 3, // 8
  CheckIn = 1 << 4, // 16
  CanView = 1 << 5, // 32
  IsOwner = 1 << 6, // 64
  xxx = 1 << 7, // 128

  test = IsOwner | EditArticleSettings
}
