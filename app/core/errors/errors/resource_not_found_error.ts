import { type UseCaseError } from '../use_case_error.ts'

export class ResourceNotFoundError extends Error implements UseCaseError {
  constructor() {
    super('Resource not found')
  }
}
