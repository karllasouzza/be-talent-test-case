import { type HttpContext } from '@adonisjs/core/http'
import UserTransformer from '#transformers/user_transformer'
import { signUpValidator } from '#validators/auth'
import { type SignUpUseCase } from '../../../../application/users/use-cases/auth/sign_up_use_case.ts'

export class SignUpController {
  private constructor(private readonly useCase: SignUpUseCase) {}

  public async handler({ request, serialize, response }: HttpContext) {
    const { email, password } = await request.validateUsing(signUpValidator)

    const result = await this.useCase.execute({ email, password })

    if (result.isLeft()) return response.badRequest(result.value)

    return response.ok(
      serialize({
        user: UserTransformer.transform(result.value.user),
        token: result.value.token,
      })
    )
  }
}
