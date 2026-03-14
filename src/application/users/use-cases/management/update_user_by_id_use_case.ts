import type User from '#models/user'
import { type Either, Left, left } from '#core/either/either'
import { CreateResourceError } from '#core/errors/create_resource_error'
import logger from '@adonisjs/core/services/logger'
import { type UsersRepository } from '../../repositories/users_repository.ts'

interface UpdateUserByIdInput {
  id: string
  fullName?: string
  email?: string
  password?: string
  role?: string
}
type UpdateUserByIdOutput = User

type Updates = Partial<Pick<User, 'fullName' | 'email' | 'password' | 'role'>>

export class UpdateUserByIdUseCase {
  constructor(
    private readonly repository: UsersRepository,
    private readonly log = logger.child({ useCase: 'UpdateUserByIdUseCase' })
  ) {}

  private getAllUpdates(input: Updates): Updates {
    const updates: Updates = {}

    if (input.fullName) {
      updates.fullName = input.fullName
    }

    if (input.email) {
      updates.email = input.email
    }
    if (input.password) {
      updates.password = input.password
    }
    if (input.role) {
      updates.role = input.role
    }

    return updates
  }

  public async execute({
    id,
    ...updates
  }: UpdateUserByIdInput): Promise<Either<CreateResourceError, UpdateUserByIdOutput>> {
    try {
      if (!id) {
        this.log.warn('Missing user ID during update')
        return left(new CreateResourceError('User ID is required'))
      }
      const updateData = this.getAllUpdates(updates)

      if (Object.keys(updateData).length === 0) {
        this.log.warn('No fields provided for update', { id })
        return left(new CreateResourceError('At least one field must be provided for update'))
      }

      const result = await this.repository.update({ id, updates: updateData })

      if (result.isLeft()) throw result

      this.log.info('User updated successfully', { result: result.value })

      return result
    } catch (error) {
      this.log.error('Error updating user', { error })

      if (error instanceof Left) {
        return error
      }

      return left(new CreateResourceError())
    }
  }
}
