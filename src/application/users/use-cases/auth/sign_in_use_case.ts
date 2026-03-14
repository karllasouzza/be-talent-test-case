import logger from '@adonisjs/core/services/logger'
import type User from '#models/user'
import { left, right, type Either } from '#core/either/either'
import { type DatabaseError } from '#core/errors/database_error'
import { UnauthorizedError } from '#core/errors/unauthorized_error'
import { RoleAbilitiesService } from '#domain-users/role/role_abilities_service'
import { type UsersRepository } from '../../repositories/users_repository.ts'
import { type TokenRepository } from '../../repositories/token_repository.ts'

interface SignInInput {
  email: string
  password: string
}

type SignInOutput = Either<UnauthorizedError | DatabaseError, { user: User; token: string }>

export class SignInUseCase {
  private constructor(
    private readonly usersRepository: UsersRepository,
    private readonly tokenRepository: TokenRepository,
    private readonly log = logger.child({ useCase: 'SignInUseCase' })
  ) {}

  async execute(input: SignInInput): Promise<SignInOutput> {
    try {
      const { email, password } = input

      const userResult = await this.usersRepository.verifyCredentials({ email, password })

      if (userResult.isLeft()) return left(userResult.value)

      this.log.debug('User verified successfully during sign in', { user: userResult.value })

      const abilities = RoleAbilitiesService.for(userResult.value.typedRole)
      const tokenResult = await this.tokenRepository.createToken({
        user: userResult.value,
        abilities,
      })
      if (tokenResult.isLeft()) return left(tokenResult.value)

      this.log.debug('Token created successfully during sign in', { token: tokenResult.value })

      return right({
        user: userResult.value,
        token: tokenResult.value,
      })
    } catch (error) {
      this.log.error('Error during sign in', { error })

      return left(new UnauthorizedError())
    }
  }
}
