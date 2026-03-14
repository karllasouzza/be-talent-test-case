import { type UseCaseError } from './use_case_error.ts'

export class SignOutError extends Error implements UseCaseError {
  constructor(message: string = 'Error during sign out') {
    super(message)
    this.name = 'SignOutError'
  }
}
