import UserTransformer from '#transformers/user_transformer'
import { type HttpContext } from '@adonisjs/core/http'
import { createUserValidator } from '#validators/users'
import { type CreateUserUseCase } from '../../../../application/users/use-cases/management/create_user_use_case.ts'
import { Ability } from '../../../../domain/users/role/ability.ts'
import { UnauthorizedError } from '../../../../core/errors/unauthorized_error.ts'

export default class CreateUserController {
  constructor(private readonly useCase: CreateUserUseCase) {}

  private checkPermissions(auth: HttpContext['auth']) {
    if (!auth.user!.currentAccessToken?.allows(Ability.USERS_CREATE)) {
      return false
    }
    return true
  }

  async handler({ request, serialize, auth, response }: HttpContext) {
    if (!this.checkPermissions(auth)) {
      return response.unauthorized(new UnauthorizedError())
    }

    const { fullName, email, password } = await request.validateUsing(createUserValidator)

    const result = await this.useCase.execute({ fullName, email, password })

    if (result.isLeft()) {
      return response.badRequest(result.value)
    }

    return response.created(
      serialize({
        user: UserTransformer.transform(result.value),
      })
    )
  }
}
