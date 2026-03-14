import type User from '#models/user'
import logger from '@adonisjs/core/services/logger'
import { type Either, left, right } from '#core/either/either'
import { InvalidOldPasswordError } from '#core/errors/invalid_old_password_error'

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
  async execute(input: UpdateSelfInput): Promise<Either<Error, UpdateSelfOutput>> {
    try {
      const { user, fullName, newEmail, oldPassword, newPassword } = input

      if (oldPassword && !(await user.verifyPassword(oldPassword))) {
        throw new InvalidOldPasswordError()
      }

      if (newPassword !== undefined) {
        user.merge({ password: newPassword })
      }

      if (newEmail !== undefined) {
        user.merge({ email: newEmail })
      }

      if (fullName !== undefined) {
        user.merge({ fullName })
      }

      await user.save()

      return right({ user })
    } catch (error) {
      log.error('Error updating user', { error })
      if (error instanceof InvalidOldPasswordError) {
        return left(error)
      }
      return left(new Error('Failed to update user'))
    }
  }
}
