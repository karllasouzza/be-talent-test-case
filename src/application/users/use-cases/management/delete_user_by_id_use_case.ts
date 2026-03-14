import { type Either, Left, left } from '../../../../core/either/either.ts'
import { CreateResourceError } from '../../../../core/errors/create_resource_error.ts'
import logger from '@adonisjs/core/services/logger'
import { type UsersRepository } from '../../repositories/users_repository.ts'

type DeleteUserByIdOutput = Either<CreateResourceError, boolean>

export class DeleteUserByIdUseCase {
  private constructor(
    private readonly repository: UsersRepository,
    private readonly log = logger.child({ useCase: 'DeleteUserByIdUseCase' })
  ) {}

  public async execute(id: string): Promise<DeleteUserByIdOutput> {
    try {
      if (!id) {
        this.log.warn('Missing user ID during deletion')
        return left(new CreateResourceError('User ID is required'))
      }

      const result = await this.repository.delete(id)
      if (result.isLeft()) throw result

      this.log.info('User deleted successfully')
      return result
    } catch (error) {
      this.log.error('Error deleting user', { error })

      if (error instanceof Left) return error
      return left(new CreateResourceError())
    }
  }
}
