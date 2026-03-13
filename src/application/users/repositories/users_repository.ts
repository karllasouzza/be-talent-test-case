import type User from '#models/user'
import { type DatabaseError } from '../../../core/errors/database_error.ts'

export interface UsersRepository {
  create(user: Pick<User, 'fullName' | 'email' | 'password' | 'role'>): Promise<User>
  find(filter: { id?: string; email?: string }): Promise<User[] | User | null>
  update(
    id: string,
    updates: Partial<Pick<User, 'fullName' | 'email' | 'password' | 'role'>>
  ): Promise<User>
  delete(id: string): Promise<boolean>
}
