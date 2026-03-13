import type User from '#models/user'
import { type UsersRepository } from '../../application/users/repositories/users_repository.ts'
import type db from '@adonisjs/lucid/services/db'

export class UsersRepositoryLucid implements UsersRepository {
  public constructor(private readonly client: typeof db) {}

  async create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const user = await this.client.transaction(async (trx) => {
      const response = await trx.insertQuery().table('users').insert({
        full_name: data.fullName,
        email: data.email,
        password: data.password,
        role: data.role,
      })

      return response[0]
    })

    return user
  }

  async findById(id: number): Promise<User | null> {
    const user = await this.client.from('users').where('id', id).first()

    return user
  }

  async findAll(filters: { id?: string; email?: string }): Promise<User[]> {
    const users = await this.client
      .from('users')
      .select('*')
      .where({
        ...filters,
      })

    return users
  }

  async update(
    user: User,
    updates: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<User> {
    await this.client
      .from('users')
      .where('id', user.id)
      .update({
        full_name: updates.fullName ?? user.fullName,
        email: updates.email ?? user.email,
        password: updates.password ?? user.password,
        role: updates.role ?? user.role,
      })
    await user.save()
    return user
  }

  async delete(id: string): Promise<void> {
    await this.client.from('users').where('id', id).delete()
  }
}
