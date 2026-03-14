import { type Either } from './../../../core/either/either.ts'
import type User from '#models/user'
import { type DatabaseError } from '../../../core/errors/database_error.ts'
import { type UnauthorizedError } from '../../../core/errors/unauthorized_error.ts'

export interface CreateUserDataRepositoryInput {
  fullName: string
  email: string
  password: string
  role: string
}
export type CreateUserDataRepositoryOutput = Either<DatabaseError, User>

export interface FindManyUsersRepositoryInput {
  id?: string | undefined
  fullName?: string | undefined
  email?: string | undefined
  role?: string | undefined
}
export type FindManyUsersRepositoryOutput = Either<DatabaseError, User[]>

export interface VerifyUserCredentialsRepositoryInput {
  email: string
  password: string
}
export type VerifyUserCredentialsRepositoryOutput = Either<UnauthorizedError, User>

export interface UpdateUserDataRepositoryInput {
  id: string
  updates: Partial<Pick<User, 'fullName' | 'email' | 'password' | 'role'>>
}
export type UpdateUserDataRepositoryOutput = Either<DatabaseError, User>

export type DeleteUserRepositoryOutput = Either<DatabaseError, boolean>

export interface UsersRepository {
  create(data: CreateUserDataRepositoryInput): Promise<CreateUserDataRepositoryOutput>
  findMany(filter: FindManyUsersRepositoryInput): Promise<FindManyUsersRepositoryOutput>
  update(data: UpdateUserDataRepositoryInput): Promise<UpdateUserDataRepositoryOutput>
  delete(id: string): Promise<DeleteUserRepositoryOutput>
  verifyCredentials(
    data: VerifyUserCredentialsRepositoryInput
  ): Promise<VerifyUserCredentialsRepositoryOutput>
}
