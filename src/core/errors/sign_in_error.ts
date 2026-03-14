import { type UseCaseError } from './use_case_error.ts'

export class SignInError extends Error implements UseCaseError {
  constructor(message: string = 'Error during sign in') {
    super(message)
    this.name = 'SignInError'
  }
}
