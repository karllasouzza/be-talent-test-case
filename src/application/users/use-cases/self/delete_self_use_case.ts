import type User from '#models/user'
import { right, type Either, left } from '#core/either/either'
import { type UsersRepository } from '../../repositories/users_repository.ts'

interface DeleteSelfResult {
  message: string
}

export class DeleteSelfUseCase {
  constructor(private readonly repository: UsersRepository) {}

  async execute(user: User): Promise<Either<Error, DeleteSelfResult>> {
    const result = await this.repository.delete(user.id)

    if (result.isLeft()) return left(new Error('Failed to delete user'))

    return right({ message: 'Account deleted successfully' })
  }
}
