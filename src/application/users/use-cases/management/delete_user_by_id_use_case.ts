import { type Either, Left, left } from '../../../../core/either/either.ts'
import { CreateResourceError } from '../../../../core/errors/create_resource_error.ts'
import logger from '@adonisjs/core/services/logger'
import { type UsersRepository } from '../../repositories/users_repository.ts'

export interface DeleteUserByIdInput {
  id: string
  fullName?: string
  email?: string
  password?: string
  role?: string
}

const log = logger.child({ useCase: 'DeleteUserByIdUseCase' })

export class DeleteUserByIdUseCase {
  constructor(private readonly repository: UsersRepository) {}

  async execute(input: DeleteUserByIdInput): Promise<Either<CreateResourceError, boolean>> {
    try {
      const result = await this.repository.delete(input.id)

      if (result.isLeft()) throw result

      log.info('User deleted successfully')

      return result
    } catch (error) {
      log.error('Error deleting user', { error })

      if (error instanceof Left) {
        return error
      }

      return left(new CreateResourceError())
    }
  }
}
