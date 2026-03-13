export const Role = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  FINANCE: 'FINANCE',
  USER: 'USER',
} as const

export type Role = (typeof Role)[keyof typeof Role]
