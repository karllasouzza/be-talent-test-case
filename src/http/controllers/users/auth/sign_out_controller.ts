import { type HttpContext } from '@adonisjs/core/http'
import { type SignOutUseCase } from '#application-users/use-cases/auth/sign_out_use_case'

export class SignOutController {
  constructor(private readonly useCase: SignOutUseCase) {}

  public async handler({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    const result = await this.useCase.execute(user)
    if (result.isLeft()) return response.badRequest(result.value)

    return response.ok({})
  }
}
