import vine from '@vinejs/vine'
import { email, password } from './users.ts'

/**
 * Validator to use when performing self-signup
 */
export const signUpValidator = vine.create({
  fullName: vine.string().nullable(),
  email: email().unique({ table: 'users', column: 'email' }),
  password: password(),
  passwordConfirmation: password().sameAs('password'),
})

/**
 * Validator to use before validating user credentials
 * during login
 */
export const signInValidator = vine.create({
  email: email(),
  password: password(),
})
