import logger from '@adonisjs/core/services/logger'
import type User from '#models/user'
import { type Either, Left, left } from '#core/either/either'
import { ResourceNotFoundError } from '#core/errors/resource_not_found_error'
import { type UsersRepository } from '../../repositories/users_repository.ts'

export interface GetManyUserInput {
  id?: string | undefined
  fullName?: string | undefined
  email?: string | undefined
  role?: string | undefined
}

export type GetManyUsersOutput = User[]

const log = logger.child({ useCase: 'GetManyUsersUseCase' })

export class GetManyUsersUseCase {
  private constructor(private readonly repository: UsersRepository) {}

  private getAllFilterProperties(query: GetManyUserInput) {
    const filter: GetManyUserInput = {}
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

  async execute(
    query: GetManyUserInput
  ): Promise<Either<ResourceNotFoundError, GetManyUsersOutput>> {
    try {
      if (
        !query ||
        (query.id === undefined &&
          query.fullName === undefined &&
          query.email === undefined &&
          query.role === undefined)
      ) {
        const response = await this.repository.findMany({})

        if (response.isLeft()) throw response

        log.info('get all users successfully', { response: response.value })
        return response
      }

      const filter = this.getAllFilterProperties(query)
      const response = await this.repository.findMany(filter)

      if (response.isLeft()) throw response

      log.info('get all users successfully', { response: response.value })

      return response
    } catch (error) {
      log.error('Error getting users', { error })

      if (error instanceof Left) {
        return error
      }

      return left(new ResourceNotFoundError())
    }
  }
}
