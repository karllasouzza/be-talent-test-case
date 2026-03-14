import User from '#models/user'
import { type UsersRepository } from '../../application/users/repositories/users_repository.ts'
import type db from '@adonisjs/lucid/services/db'
import { DatabaseError } from '../../core/errors/database_error.ts'
import { UnauthorizedError } from '../../core/errors/unauthorized_error.ts'
import { left, right, type Either } from '../../core/either/either.ts'
import logger from '@adonisjs/core/services/logger'

const log = logger.child({ repository: 'UsersRepositoryLucid' })

export class UsersRepositoryLucid implements UsersRepository {
  public constructor(private readonly client: typeof db) {}

  async create(
    data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Either<DatabaseError, User>> {
    try {
      const user = await this.client.transaction(async (trx) => {
        const response = await trx.insertQuery().table('users').insert({
          full_name: data.fullName,
          email: data.email,
          password: data.password,
          role: data.role,
        })

        return response[0]
      })

      return right(user)
    } catch (error) {
      log.error('Error creating user', { error })
      return left(new DatabaseError('Error creating user'))
    }
  }

  async findMany(filters: { id?: string; email?: string }): Promise<Either<DatabaseError, User[]>> {
    try {
      const users = await this.client
        .from('users')
        .select('*')
        .where({
          ...filters,
        })

      return right(users)
    } catch (error) {
      log.error('Error finding users', { error })

      return left(new DatabaseError('Error finding users'))
    }
  }

  async update(
    id: string,
    updates: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<Either<DatabaseError, User>> {
    try {
      const user = await this.client.transaction(async (trx) => {
        const response = await trx
          .from('users')
          .where('id', id)
          .update({
            ...updates,
          })
          .returning('*')

        return response[0]
      })

      return right(user)
    } catch (error) {
      log.error('Error updating user', { error })
      return left(new DatabaseError('Error updating user'))
    }
  }

  async delete(id: string): Promise<Either<DatabaseError, boolean>> {
    try {
      await this.client.transaction(async (trx) => {
        await trx.from('users').where('id', id).delete()
      })

      return right(true)
    } catch (error) {
      log.error('Error deleting user', { error })
      return left(new DatabaseError('Error deleting user'))
    }
  }

  async verifyCredentials(
    email: string,
    password: string
  ): Promise<Either<UnauthorizedError, User>> {
    try {
      const user = await User.verifyCredentials(email, password)
      return right(user)
    } catch (error) {
      log.error('Error verifying credentials', { error })
      return left(new UnauthorizedError('Invalid credentials'))
    }
  }

  async createToken(user: User, abilities: string[]): Promise<Either<DatabaseError, string>> {
    try {
      const token = await User.accessTokens.create(user, abilities)
      return right(token.value!.release())
    } catch (error) {
      log.error('Error creating token', { error })
      return left(new DatabaseError('Error creating token'))
    }
  }

  async deleteToken(token: string): Promise<Either<DatabaseError, void>> {
    try {
      await User.accessTokens.delete(token)
      return right({})
    } catch (error) {
      log.error('Error revoking token', { error })
      return left(new DatabaseError('Error revoking token'))
    }
  }
}
