export const Ability = {
  ALL: '*',
  USERS_READ: 'users:read',
  USERS_CREATE: 'users:create',
  USERS_UPDATE: 'users:update',
  USERS_DELETE: 'users:delete',
  SELF_READ: 'self:read',
  SELF_UPDATE: 'self:update',
  SELF_DELETE: 'self:delete',
} as const

export type Ability = (typeof Ability)[keyof typeof Ability]
