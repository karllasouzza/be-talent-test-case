import { left, right, type Either } from '../../../../core/either/either.ts'
import { type DatabaseError } from '../../../../core/errors/database_error.ts'
import { type UnauthorizedError } from '../../../../core/errors/unauthorized_error.ts'
import { SignUpError } from '../../../../core/errors/sign_up_error.ts'
import { RoleAbilitiesService } from '../../../../domain/users/role/role_abilities_service.ts'
import type User from '#models/user'
import { type UsersRepository } from '../../repositories/users_repository.ts'
import logger from '@adonisjs/core/services/logger'
import { Role } from '../../../../domain/users/role/role.ts'

interface SignInInput {
  email: string
  password: string
  fullName: string
}

export class SignInUseCase {
  private readonly log = logger.child({ useCase: 'SignInUseCase' })

  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(
    input: SignInInput
  ): Promise<
    Either<UnauthorizedError | DatabaseError | SignUpError, { user: User; token: string }>
  > {
    try {
      const { email, password, fullName } = input

      const userResult = await this.usersRepository.create({
        fullName,
        email,
        password,
        role: Role.USER,
      })

      if (userResult.isLeft()) return left(userResult.value)

      this.log.debug('User created successfully during sign in', { user: userResult.value })

      const abilities = RoleAbilitiesService.for(userResult.value.typedRole)
      const tokenResult = await this.usersRepository.createToken(userResult.value, abilities)
      if (tokenResult.isLeft()) return left(tokenResult.value)

      this.log.debug('Token created successfully during sign in', { token: tokenResult.value })

      return right({
        user: userResult.value,
        token: tokenResult.value,
      })
    } catch (error) {
      this.log.error('Error during sign in', { error })

      return left(new SignUpError())
    }
  }
}
