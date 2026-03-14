import type User from '#models/user'
import logger from '@adonisjs/core/services/logger'
import { left, right, type Either } from '#core/either/either'
import { type DatabaseError } from '#core/errors/database_error'
import { SignOutError } from '#core/errors/sign_out_error'
import { type TokenRepository } from '../../repositories/token_repository.ts'

type SignOutOutput = Either<DatabaseError | SignOutError, void>

export class SignOutUseCase {
  constructor(
    private readonly tokenRepository: TokenRepository,
    private readonly log = logger.child({ useCase: 'SignOutUseCase' })
  ) {}

  public async execute(user: User): Promise<SignOutOutput> {
    try {
      if (!user.currentAccessToken) {
        this.log.warn('User has no active token during sign out', { userId: user.id })
        return right(undefined)
      }

      const result = await this.tokenRepository.deleteToken(user)
      if (result.isLeft()) return left(result.value)

      this.log.debug('Token deleted successfully during sign out', { userId: user.id })
      return right(undefined)
    } catch (error) {
      this.log.error('Error during sign out', { error })
      return left(new SignOutError())
    }
  }
}
