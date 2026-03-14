import logger from '@adonisjs/core/services/logger'
import type db from '@adonisjs/lucid/services/db'
import User from '#models/user'
import { DatabaseError } from '#core/errors/database_error'
import { left, right } from '#core/either/either'
import type {
  CreateTokenInput,
  CreateTokenOutput,
  DeleteTokenOutput,
  TokenRepository,
} from '#application-users/repositories/token_repository'

export class TokenRepositoryLucid implements TokenRepository {
  constructor(
    private readonly client: typeof db,
    private readonly log = logger.child({ repository: 'TokenRepositoryLucid' })
  ) {}

  async createToken({ user, abilities }: CreateTokenInput): Promise<CreateTokenOutput> {
    try {
      const token = await User.accessTokens.create(user, abilities)

      if (!token.value) {
        this.log.error('Token creation failed without throwing an error', { userId: user.id })
        return left(new DatabaseError('Failed to create token'))
      }

      return right(token.value.release())
    } catch (error) {
      this.log.error('Error creating token', { error })
      return left(new DatabaseError('Error creating token'))
    }
  }

  async deleteToken(user: User): Promise<DeleteTokenOutput> {
    try {
      if (!user.currentAccessToken) {
        this.log.warn('No current access token found for user during token deletion', {
          userId: user.id,
        })
        return right(undefined)
      }

      await this.client.transaction(async (trx) => {
        await trx
          .from('auth_access_tokens')
          .where('id', Number(user.currentAccessToken!.identifier))
          .delete()
      })
      return right(undefined)
    } catch (error) {
      this.log.error('Error revoking token', { error })
      return left(new DatabaseError('Error revoking token'))
    }
  }
}
