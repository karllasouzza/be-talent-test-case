import type User from '../../infrastructure/persistence/lucid/models/user.ts'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class UserTransformer extends BaseTransformer<User> {
  toObject() {
    return this.pick(this.resource, ['id', 'fullName', 'email', 'role', 'createdAt', 'updatedAt'])
  }
}
