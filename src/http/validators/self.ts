import vine from '@vinejs/vine'

/**
 * Shared rules for email and password.
 */
const email = () => vine.string().email().maxLength(254)
const password = () => vine.string().minLength(8).maxLength(32)

/**
 * Validator to use when performing self-signup
 */
export const signupValidator = vine.create({
  fullName: vine.string().nullable(),
  email: email().unique({ table: 'users', column: 'email' }),
  password: password().sameAs('passwordConfirmation'),
  passwordConfirmation: password(),
})

/**
 * Validator to use when updating self information
 */
export const updateSelfValidator = vine.create({
  fullName: vine.string().nullable(),
  oldEmail: email().unique({ table: 'users', column: 'email' }).optional(),
  newEmail: email()
    .unique({ table: 'users', column: 'email' })
    .optional()
    .requiredIfExists('oldEmail'),
  oldPassword: password().notSameAs('newPassword').optional(),
  newPassword: password()
    .sameAs('newPasswordConfirmation')
    .optional()
    .requiredIfExists('oldPassword'),
  newPasswordConfirmation: password()
    .sameAs('newPassword')
    .optional()
    .requiredIfExists('oldPassword'),
})
