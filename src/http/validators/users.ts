import vine from '@vinejs/vine'
import { Role } from '../../domain/users/role/role.ts'

export const email = () => vine.string().email().maxLength(254)
export const password = () => vine.string().minLength(8).maxLength(32)

/**
 * Validator to use when performing user creation
 */
export const createUserValidator = vine.create({
  fullName: vine.string(),
  email: email().unique({ table: 'users', column: 'email' }),
  password: password(),
  passwordConfirmation: password().sameAs('password'),
  role: vine.enum(Role).optional(),
})

/**
 * Validator to use when performing user update
 */
export const getAllUsersValidator = vine.create({
  id: vine.string().uuid().optional(),
  fullName: vine.string().optional(),
  email: email().optional(),
  role: vine.enum(Role).optional(),
})

/**
 * Validator to use when performing user update
 */
export const updateUserValidator = vine.create({
  id: vine.string().uuid(),
  fullName: vine.string().optional(),
  email: email().unique({ table: 'users', column: 'email' }).optional(),
  password: password().optional(),
  role: vine.enum(Role).optional(),
})

export const deleteUserValidator = vine.create({
  id: vine.string().uuid(),
})
