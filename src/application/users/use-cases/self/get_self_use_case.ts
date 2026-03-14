import type User from '#models/user'
import { type Either, left, right } from '#core/either/either'
import { ResourceNotFoundError } from '#core/errors/resource_not_found_error'
import { type UsersRepository } from '../../repositories/users_repository.ts'

export class GetSelfUseCase {
  constructor(private readonly repository: UsersRepository) {}

  async execute(user: User): Promise<Either<ResourceNotFoundError, User>> {
    const result = await this.repository.findMany({ id: user.id })

    if (result.isLeft()) return left(new ResourceNotFoundError())

    const found = result.value[0]
    if (!found) return left(new ResourceNotFoundError())

    return right(found)
  }
}
