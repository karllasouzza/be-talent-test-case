import type db from '@adonisjs/lucid/services/db'
import logger from '@adonisjs/core/services/logger'
import User from '#models/user'
import { DatabaseError } from '../../../../core/errors/database_error.ts'
import { UnauthorizedError } from '../../../../core/errors/unauthorized_error.ts'
import { left, right, type Either } from '../../../../core/either/either.ts'
import type {
  CreateUserDataRepositoryOutput,
  CreateUserDataRepositoryInput,
  FindManyUsersRepositoryInput,
  FindManyUsersRepositoryOutput,
  UpdateUserDataRepositoryInput,
  UpdateUserDataRepositoryOutput,
  VerifyUserCredentialsRepositoryInput,
  VerifyUserCredentialsRepositoryOutput,
  UsersRepository,
} from '../../../../application/users/repositories/users_repository.ts'

export class UsersRepositoryLucid implements UsersRepository {
  private constructor(
    private readonly client: typeof db,
    private readonly log = logger.child({ repository: 'UsersRepositoryLucid' })
  ) {}

  public async create({
    fullName,
    email,
    password,
    role,
  }: CreateUserDataRepositoryInput): Promise<CreateUserDataRepositoryOutput> {
    try {
      if (!fullName || !email || !password) {
        this.log.warn('Missing required fields during user creation', { email })
        return left(new DatabaseError('All fields are required'))
      }

      const id = crypto.randomUUID()

      const user = await this.client.transaction(async (trx) => {
        await trx.insertQuery().table('users').insert({
          id,
          full_name: fullName,
          email,
          password,
          role,
        })

        const [row] = await trx.from('users').select('*').where('id', id)
        return row
      })

      if (!user) {
        this.log.warn('User creation failed without throwing an error', { email })
        return left(new DatabaseError('Failed to create user'))
      }

      return right(user)
    } catch (error) {
      this.log.error('Error creating user', { error })
      return left(new DatabaseError('Error creating user'))
    }
  }

  async verifyCredentials({
    email,
    password,
  }: VerifyUserCredentialsRepositoryInput): Promise<VerifyUserCredentialsRepositoryOutput> {
    try {
      if (!email || !password) {
        this.log.warn('Email or password not provided during credential verification', { email })
        return left(new UnauthorizedError('Email and password are required'))
      }

      const user = await User.verifyCredentials(email, password)

      if (!user) {
        this.log.warn('Invalid credentials provided during verification', { email })
        return left(new UnauthorizedError('Invalid credentials'))
      }

      return right(user)
    } catch (error) {
      this.log.error('Error verifying credentials', { error })
      return left(new UnauthorizedError('Invalid credentials'))
    }
  }

  public async findMany(
    filters: FindManyUsersRepositoryInput
  ): Promise<FindManyUsersRepositoryOutput> {
    try {
      const users = await this.client
        .from('users')
        .select('*')
        .where({
          ...filters,
        })

      return right(users)
    } catch (error) {
      this.log.error('Error finding users', { error })
      return left(new DatabaseError('Error finding users'))
    }
  }

  public async update({
    id,
    updates,
  }: UpdateUserDataRepositoryInput): Promise<UpdateUserDataRepositoryOutput> {
    try {
      if (!id) {
        this.log.warn('User ID is required for update operation')
        return left(new DatabaseError('User ID is required'))
      }

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

      if (!user) {
        this.log.warn('User update failed without throwing an error', { id })
        return left(new DatabaseError('Failed to update user'))
      }

      return right(user)
    } catch (error) {
      this.log.error('Error updating user', { error })
      return left(new DatabaseError('Error updating user'))
    }
  }

  public async delete(id: string): Promise<Either<DatabaseError, boolean>> {
    try {
      if (!id) {
        this.log.warn('User ID is required for delete operation')
        return left(new DatabaseError('User ID is required'))
      }

      await this.client.transaction(async (trx) => {
        await trx.from('users').where('id', id).delete()
      })

      return right(true)
    } catch (error) {
      this.log.error('Error deleting user', { error })
      return left(new DatabaseError('Error deleting user'))
    }
  }
}
