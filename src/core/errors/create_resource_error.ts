import { type UseCaseError } from './use_case_error.ts'

export class CreateResourceError extends Error implements UseCaseError {
  constructor(message: string = 'Failed to create resource.') {
    super(message)
    this.name = 'CreateResourceError'
  }
}
