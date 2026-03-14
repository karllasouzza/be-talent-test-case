import type User from '#models/user'
import type { Either } from '../../../core/either/either.ts'
import type { DatabaseError } from '../../../core/errors/database_error.ts'

export interface CreateTokenInput {
  user: User
  abilities: string[]
}
export type CreateTokenOutput = Either<DatabaseError, string>

export type DeleteTokenOutput = Either<DatabaseError, void>

export interface TokenRepository {
  createToken(data: CreateTokenInput): Promise<CreateTokenOutput>
  deleteToken(user: User): Promise<DeleteTokenOutput>
}
