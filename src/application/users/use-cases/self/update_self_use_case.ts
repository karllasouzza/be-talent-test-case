import type User from '#models/user'
import logger from '@adonisjs/core/services/logger'
import { type Either, Left, left, right } from '#core/either/either'
import { InvalidOldPasswordError } from '#core/errors/invalid_old_password_error'
import { type UsersRepository } from '../../repositories/users_repository.ts'

export interface UpdateSelfInput {
  user: User
  fullName?: string | null
  newEmail?: string
  oldPassword?: string
  newPassword?: string
}

interface UpdateSelfOutput {
  user: User
}

const log = logger.child({ useCase: 'UpdateSelfUseCase' })

export class UpdateSelfUseCase {
  constructor(private readonly repository: UsersRepository) {}

  async execute(input: UpdateSelfInput): Promise<Either<Error, UpdateSelfOutput>> {
    try {
      const { user, fullName, newEmail, oldPassword, newPassword } = input

      if (oldPassword) {
        const credResult = await this.repository.verifyCredentials({
          email: user.email,
          password: oldPassword,
        })
        if (credResult.isLeft()) return left(new InvalidOldPasswordError())
      }

      const updates: Parameters<UsersRepository['update']>[0]['updates'] = {}

      if (fullName !== undefined) updates.fullName = fullName ?? undefined
      if (newEmail !== undefined) updates.email = newEmail
      if (newPassword !== undefined) updates.password = newPassword

      const result = await this.repository.update({ id: user.id, updates })

      if (result.isLeft()) throw result

      log.info('User updated successfully')

      return right({ user: result.value })
    } catch (error) {
      log.error('Error updating user', { error })
      if (error instanceof Left) return error
      if (error instanceof InvalidOldPasswordError) return left(error)
      return left(new Error('Failed to update user'))
    }
  }
}
