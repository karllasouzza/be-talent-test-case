import { type HttpContext } from '@adonisjs/core/http'
import { signUpValidator } from '#validators/auth'
import { type SignOutUseCase } from '../../../application/users/use-cases/auth/sign_out_use_case.ts'

export class SignOutController {
  constructor(private readonly useCase: SignOutUseCase) {}

  async handler({ request, response }: HttpContext) {
    const { email, password } = await request.validateUsing(signUpValidator)

    const result = await this.useCase.execute({ email, password })

    if (result.isLeft()) return response.badRequest(result.value)

    return response.ok({})
  }
}
