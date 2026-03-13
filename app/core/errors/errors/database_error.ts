import { type UseCaseError } from '../use_case_error.ts'

export class DatabaseError extends Error implements UseCaseError {
  constructor(message: string = 'A database error occurred.') {
    super(message)
    this.name = 'DatabaseError'
  }
}
