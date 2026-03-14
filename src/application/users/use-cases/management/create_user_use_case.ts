import type User from '../../../../infrastructure/persistence/lucid/models/user.ts'
import { type Either, Left, left } from '../../../../core/either/either.ts'
import { CreateResourceError } from '../../../../core/errors/create_resource_error.ts'
import logger from '@adonisjs/core/services/logger'
import { type UsersRepository } from '../../repositories/users_repository.ts'
import { Role } from '../../../../domain/users/role/role.ts'

export interface CreateUserInput {
  fullName: string
  email: string
  password: string
  role?: string
}

export type CreateUserOutput = User

const log = logger.child({ useCase: 'CreateUserUseCase' })

export class CreateUserUseCase {
  constructor(private readonly repository: UsersRepository) {}
  async execute(input: CreateUserInput): Promise<Either<CreateResourceError, CreateUserOutput>> {
    try {
      const result = await this.repository.create({
        ...input,
        role: input.role ?? Role.USER,
      })

      if (result.isLeft()) throw result

      log.info('User created successfully', { result: result.value })

      return result
    } catch (error) {
      log.error('Error creating user', { error })

      if (error instanceof Left) {
        return error
      }

      return left(new CreateResourceError())
    }
  }
}
