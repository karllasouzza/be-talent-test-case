import type User from '../../../../infrastructure/persistence/lucid/models/user.ts'
import { type Either, Left, left, right } from '../../../../core/either/either.ts'
import { CreateResourceError } from '../../../../core/errors/create_resource_error.ts'
import logger from '@adonisjs/core/services/logger'
import { type UsersRepository } from '../../repositories/users_repository.ts'

export interface UpdateUserByIdInput {
  id: string
  fullName?: string
  email?: string
  password?: string
  role?: string
}

export type UpdateUserByIdOutput = User

type Updates = Partial<Pick<User, 'fullName' | 'email' | 'password' | 'role'>>

const log = logger.child({ useCase: 'UpdateUserByIdUseCase' })

export class UpdateUserByIdUseCase {
  constructor(private readonly repository: UsersRepository) {}

  async execute(
    input: UpdateUserByIdInput
  ): Promise<Either<CreateResourceError, UpdateUserByIdOutput>> {
    try {
      const updates = this.getAllUpdates(input)

      const result = await this.repository.update(input.id, updates)

      if (result.isLeft()) throw result

      log.info('User updated successfully', { result: result.value })

      return right(result.value)
    } catch (error) {
      log.error('Error updating user', { error })

      if (error instanceof Left) {
        return error
      }

      return left(new CreateResourceError())
    }
  }

  private getAllUpdates(input: UpdateUserByIdInput): Updates {
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
}
