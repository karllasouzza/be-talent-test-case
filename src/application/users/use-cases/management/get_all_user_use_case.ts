import type User from '../../../../infrastructure/persistence/lucid/models/user.ts'
import { type Either, left, right } from '../../../../core/either/either.ts'
import logger from '@adonisjs/core/services/logger'
import { ResourceNotFoundError } from '../../../../core/errors/resource_not_found_error.ts'

export interface GetUserAllInput {
  id?: string | null
  fullName?: string | null
  email?: string | null
  role?: string | null
}

export type GetAllUserOutput = User[]

const log = logger.child({ useCase: 'GetAllUserUseCase' })

export class GetAllUserUseCase {
  private constructor(private readonly repository: any) {}

  private getAllFilterProperties(query: GetUserAllInput) {
    const filter: GetUserAllInput = {}
    if (query.id !== undefined) {
      filter.id = query.id
    }

    if (query.fullName !== undefined) {
      filter.fullName = query.fullName
    }

    if (query.email !== undefined) {
      filter.email = query.email
    }

    if (query.role !== undefined) {
      filter.role = query.role
    }

    return filter
  }

  async execute(query: GetUserAllInput): Promise<Either<ResourceNotFoundError, GetAllUserOutput>> {
    try {
      if (
        !query ||
        (query.id === undefined &&
          query.fullName === undefined &&
          query.email === undefined &&
          query.role === undefined)
      ) {
        const users = await this.repository.find({})
        return right({ users })
      }

      const filter = this.getAllFilterProperties(query)
      const response = await this.repository.find(filter)

      if (response.isLeft()) throw response

      log.info('get all users successfully', { response.value })

      return right(response.value)
    } catch (error) {
      log.error('Error getting users', { error })

      if (error instanceof Left) {
        return error
      }

      return left(new ResourceNotFoundError())
    }
  }
}
