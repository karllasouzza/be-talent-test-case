import { type UseCaseError } from './use_case_error.ts'

export class SignUpError extends Error implements UseCaseError {
  constructor(message: string = 'Error during sign up') {
    super(message)
    this.name = 'SignUpError'
  }
}
