import User from '#models/user'
import { type AccessToken } from '@adonisjs/auth/access_tokens'
import { type Either, left, right } from '#core/either/either'
import { CreateResourceError } from '#core/errors/create_resource_error'
import logger from '@adonisjs/core/services/logger'

export interface RegisterSelfInput {
  fullName: string | null
  email: string
  password: string
}

export interface RegisterSelfOutput {
  user: User
  token: AccessToken
}

const log = logger.child({ useCase: 'RegisterSelfUseCase' })

export class RegisterSelfUseCase {
  async execute(
    input: RegisterSelfInput
  ): Promise<Either<CreateResourceError, RegisterSelfOutput>> {
    try {
      const user = await User.create(input)
      const token = await User.accessTokens.create(user)

      log.info('User registered successfully', { user, token })

      return right({ user, token })
    } catch (error) {
      log.error('Error registering user', { error })
      return left(new CreateResourceError())
    }
  }
}
