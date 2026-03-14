import { left, right, type Either } from '../../../../core/either/either.ts'
import { type DatabaseError } from '../../../../core/errors/database_error.ts'
import { type UnauthorizedError } from '../../../../core/errors/unauthorized_error.ts'
import { SignOutError } from '../../../../core/errors/sign_out_error.ts'
import { RoleAbilitiesService } from '../../../../domain/users/role/role_abilities_service.ts'
import type User from '#models/user'
import { type UsersRepository } from '../../repositories/users_repository.ts'
import logger from '@adonisjs/core/services/logger'
import { email, password } from '#validators/users'

export class SignOutUseCase {
  private readonly log = logger.child({ useCase: 'SignOutUseCase' })
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(): Promise<Either<DatabaseError | SignOutError, void>> {
    try {
      const userResult = await this.usersRepository.verifyCredentials(email, password)
      if (userResult.isLeft()) return left(userResult.value)

      const abilities = RoleAbilitiesService.for(userResult.value.typedRole)
      const tokenResult = await this.usersRepository.createToken(userResult.value, abilities)
      if (tokenResult.isLeft()) return left(tokenResult.value)

      return right({})
    } catch (error) {
      this.log.error('Error during sign out', { error })

      return left(new SignOutError())
    }
  }
}
