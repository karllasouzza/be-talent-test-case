import { type UseCaseError } from '../use_case_error.ts'

export class InvalidDataError extends Error implements UseCaseError {
  constructor(message: string = 'Invalid data provided.') {
    super(message)
    this.name = 'InvalidDataError'
  }
}
