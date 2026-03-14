import type User from '#models/user'
import { type Either, Left, left, right } from '#core/either/either'
import { CreateResourceError } from '#core/errors/create_resource_error'
import { Role } from '#domain-users/role/role'
import { RoleAbilitiesService } from '#domain-users/role/role_abilities_service'
import logger from '@adonisjs/core/services/logger'
import { type UsersRepository } from '../../repositories/users_repository.ts'
import { type TokenRepository } from '../../repositories/token_repository.ts'

export interface RegisterSelfInput {
  fullName: string
  email: string
  password: string
}

export interface RegisterSelfOutput {
  user: User
  token: string
}

const log = logger.child({ useCase: 'RegisterSelfUseCase' })

export class RegisterSelfUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly tokenRepository: TokenRepository
  ) {}

  async execute(
    input: RegisterSelfInput
  ): Promise<Either<CreateResourceError, RegisterSelfOutput>> {
    try {
      const { fullName, email, password } = input

      const userResult = await this.usersRepository.create({
        fullName,
        email,
        password,
        role: Role.USER,
      })

      if (userResult.isLeft()) throw userResult

      const abilities = RoleAbilitiesService.for(userResult.value.typedRole)
      const tokenResult = await this.tokenRepository.createToken({
        user: userResult.value,
        abilities,
      })

      if (tokenResult.isLeft()) throw tokenResult

      log.info('User registered successfully')

      return right({ user: userResult.value, token: tokenResult.value })
    } catch (error) {
      log.error('Error registering user', { error })
      if (error instanceof Left) return error
      return left(new CreateResourceError())
    }
  }
}
