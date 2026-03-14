import UserTransformer from '#transformers/user_transformer'
import { getManyUsersValidator } from '#validators/users'
import { type HttpContext } from '@adonisjs/core/http'
import { Ability } from '#domain-users/role/ability'
import { type GetManyUsersUseCase } from '#application-users/use-cases/management/get_many_user_use_case'
import { UnauthorizedError } from '#core/errors/unauthorized_error'

export default class GetManyUsersController {
  constructor(private readonly useCase: GetManyUsersUseCase) {}

  private checkPermissions(auth: HttpContext['auth']) {
    if (!auth.user!.currentAccessToken?.allows(Ability.USERS_READ)) {
      return false
    }
    return true
  }

  async handler({ request, serialize, auth, response }: HttpContext) {
    if (!this.checkPermissions(auth)) {
      return response.unauthorized(new UnauthorizedError())
    }

    const { id, fullName, email, role } = await request.validateUsing(getManyUsersValidator)

    const result = await this.useCase.execute({ id, fullName, email, role })

    if (result.isLeft()) {
      return response.badRequest(result.value)
    }

    return serialize({
      users: UserTransformer.transform(result.value),
    })
  }
}
