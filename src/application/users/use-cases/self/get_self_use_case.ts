import type User from '../../../../infrastructure/persistence/lucid/models/user.ts'

export class GetSelfUseCase {
  execute(user: User): User {
    return user
  }
}
