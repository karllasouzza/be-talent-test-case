import logger from '@adonisjs/core/services/logger'
import type User from '#models/user'
import { left, right, type Either } from '#core/either/either'
import { type DatabaseError } from '#core/errors/database_error'
import { UnauthorizedError } from '#core/errors/unauthorized_error'
import { SignUpError } from '#core/errors/sign_up_error'
import { RoleAbilitiesService } from '#domain-users/role/role_abilities_service'
import { type UsersRepository } from '../../repositories/users_repository.ts'
import { type TokenRepository } from '../../repositories/token_repository.ts'

interface SignUpInput {
  email: string
  password: string
}

type SignUpOutput = Either<
  UnauthorizedError | DatabaseError | SignUpError,
  { user: User; token: string }
>

export class SignUpUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly tokenRepository: TokenRepository,
    private readonly log = logger.child({ useCase: 'SignUpUseCase' })
  ) {}

  public async execute(input: SignUpInput): Promise<SignUpOutput> {
    try {
      const { email, password } = input

      if (!email || !password) {
        this.log.warn('Email or password not provided during sign up', { email })
        return left(new UnauthorizedError('Email and password are required'))
      }

      const userResult = await this.usersRepository.verifyCredentials({ email, password })
      if (userResult.isLeft()) return left(userResult.value)

      const abilities = RoleAbilitiesService.for(userResult.value.typedRole)

      const tokenResult = await this.tokenRepository.createToken({
        user: userResult.value,
        abilities,
      })
      if (tokenResult.isLeft()) return left(tokenResult.value)

      return right({
        user: userResult.value,
        token: tokenResult.value,
      })
    } catch (error) {
      this.log.error('Error during sign up', { error })

      return left(new SignUpError())
    }
  }
}
