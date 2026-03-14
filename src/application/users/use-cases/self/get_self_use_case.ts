import type User from '#models/user'

export class GetSelfUseCase {
  execute(user: User): User {
    return user
  }
}
