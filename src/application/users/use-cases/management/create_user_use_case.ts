import logger from '@adonisjs/core/services/logger'
import type User from '#models/user'
import { type Either, Left, left } from '#core/either/either'
import { CreateResourceError } from '#core/errors/create_resource_error'
import { Role } from '#domain-users/role/role'
import { type UsersRepository } from '../../repositories/users_repository.ts'

export interface CreateUserInput {
  fullName: string
  email: string
  password: string
  role?: string
}

export type CreateUserOutput = User

export class CreateUserUseCase {
  private constructor(
    private readonly repository: UsersRepository,
    private readonly log = logger.child({ useCase: 'CreateUserUseCase' })
  ) {}

  public async execute({
    fullName,
    email,
    password,
    role,
  }: CreateUserInput): Promise<Either<CreateResourceError, CreateUserOutput>> {
    try {
      if (!fullName || !email || !password) {
        this.log.warn('Missing required fields during user creation', { email })
        return left(new CreateResourceError('All fields are required'))
      }

      const result = await this.repository.create({
        fullName,
        email,
        password,
        role: role ?? Role.USER,
      })

      if (result.isLeft()) throw result

      this.log.info('User created successfully', { result: result.value })
      return result
    } catch (error) {
      this.log.error('Error creating user', { error })

      if (error instanceof Left) return error
      return left(new CreateResourceError())
    }
  }
}
