import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    // Truncate dependent table first to remove FK constraint data
    await this.db.rawQuery('SET FOREIGN_KEY_CHECKS = 0')
    await this.db.rawQuery('TRUNCATE TABLE auth_access_tokens')
    await this.db.rawQuery('TRUNCATE TABLE users')
    await this.db.rawQuery('SET FOREIGN_KEY_CHECKS = 1')

    // Drop FK on auth_access_tokens.tokenable_id before altering users.id
    this.schema.alterTable('auth_access_tokens', (table) => {
      table.dropForeign(['tokenable_id'])
    })

    // Change users.id from INT auto-increment to CHAR(36) UUID
    this.schema.alterTable('users', (table) => {
      table.dropPrimary()
      table.string('id', 36).notNullable().alter()
    })

    this.schema.alterTable('users', (table) => {
      table.primary(['id'])
    })

    // Change tokenable_id to CHAR(36) and re-add the FK
    this.schema.alterTable('auth_access_tokens', (table) => {
      table.string('tokenable_id', 36).notNullable().alter()
      table.foreign('tokenable_id').references('id').inTable('users').onDelete('CASCADE')
    })
  }

  async down() {
    await this.db.rawQuery('SET FOREIGN_KEY_CHECKS = 0')
    await this.db.rawQuery('TRUNCATE TABLE auth_access_tokens')
    await this.db.rawQuery('TRUNCATE TABLE users')
    await this.db.rawQuery('SET FOREIGN_KEY_CHECKS = 1')

    this.schema.alterTable('auth_access_tokens', (table) => {
      table.dropForeign(['tokenable_id'])
    })

    this.schema.alterTable('users', (table) => {
      table.dropPrimary()
      table.increments('id').primary().alter()
    })

    this.schema.alterTable('auth_access_tokens', (table) => {
      table.integer('tokenable_id').unsigned().notNullable().alter()
      table.foreign('tokenable_id').references('id').inTable('users').onDelete('CASCADE')
    })
  }
}
