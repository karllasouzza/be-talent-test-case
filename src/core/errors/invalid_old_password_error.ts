import { type UseCaseError } from './use_case_error.ts'

export class InvalidOldPasswordError extends Error implements UseCaseError {
  constructor(message: string = 'Old password is incorrect') {
    super(message)
    this.name = 'InvalidOldPasswordError'
  }
}
