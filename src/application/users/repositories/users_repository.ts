import { type Either } from './../../../core/either/either.ts'
import type User from '#models/user'
import { type DatabaseError } from '../../../core/errors/database_error.ts'
import { type UnauthorizedError } from '../../../core/errors/unauthorized_error.ts'

export interface UsersRepository {
  create(
    user: Pick<User, 'fullName' | 'email' | 'password' | 'role'>
  ): Promise<Either<DatabaseError, User>>
  findMany(filter: {
    id?: string | undefined
    fullName?: string | undefined
    email?: string | undefined
    role?: string | undefined
  }): Promise<Either<DatabaseError, User[]>>
  update(
    id: string,
    updates: Partial<Pick<User, 'fullName' | 'email' | 'password' | 'role'>>
  ): Promise<Either<DatabaseError, User>>
  delete(id: string): Promise<Either<DatabaseError, boolean>>
  verifyCredentials(email: string, password: string): Promise<Either<UnauthorizedError, User>>
  createToken(user: User, abilities: string[]): Promise<Either<DatabaseError, string>>
}
