import { type HttpContext } from '@adonisjs/core/http'
import { signInValidator } from '#validators/auth'
import UserTransformer from '#transformers/user_transformer'
import type { SignInUseCase } from '#application-users/use-cases/auth/sign_in_use_case'

export class SignInController {
  private constructor(private readonly useCase: SignInUseCase) {}

  public async handler({ request, serialize, response }: HttpContext) {
    const { email, password } = await request.validateUsing(signInValidator)

    const result = await this.useCase.execute({ email, password })

    if (result.isLeft()) return response.badRequest(result.value)

    const { user, token } = result.value

    return response.ok(
      serialize({
        user: UserTransformer.transform(user),
        token: token,
      })
    )
  }
}
