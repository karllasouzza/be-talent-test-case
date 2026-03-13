import type User from '../../../../infrastructure/persistence/lucid/models/user.ts'
import { right, type Either, left } from '../../../../core/either/either.ts'

interface DeleteSelfResult {
  message: string
}

export class DeleteSelfUseCase {
  async execute(user: User): Promise<Either<Error, DeleteSelfResult>> {
    try {
      await user.delete()

      return right({
        message: 'Account deleted successfully',
      })
    } catch {
      return left(new Error('Failed to delete user'))
    }
  }
}
