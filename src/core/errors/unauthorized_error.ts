import { type UseCaseError } from './use_case_error.ts'

export class UnauthorizedError extends Error implements UseCaseError {
  constructor(message: string = 'Unauthorized') {
    super(message)
  }
}
