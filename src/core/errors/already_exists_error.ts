import { type UseCaseError } from './use_case_error.ts'

export class AlreadyExistsError extends Error implements UseCaseError {
  constructor(message: string = 'Resource already exists.') {
    super(message)
    this.name = 'AlreadyExistsError'
  }
}
