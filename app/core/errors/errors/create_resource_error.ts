import { type UseCaseError } from '../use_case_error.ts'

export class CreateResourceError extends Error implements UseCaseError {
  constructor() {
    super('Failed to create resource.')
  }
}
