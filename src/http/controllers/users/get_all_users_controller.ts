import UserTransformer from '#transformers/user_transformer'
import { getAllUsersValidator } from '#validators/users'
import { type HttpContext } from '@adonisjs/core/http'
import { Ability } from '../../../domain/users/role/ability.ts'
import { type GetAllUserUseCase } from '../../../application/users/use-cases/management/get_all_user_use_case.ts'
import { UnauthorizedError } from '../../../core/errors/unauthorized_error.ts'

export default class GetUserController {
  constructor(private readonly useCase: GetAllUserUseCase) {}

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

    const { id, fullName, email, role } = await request.validateUsing(getAllUsersValidator)

    const result = await this.useCase.execute({ id, fullName, email, role })

    if (result.isLeft()) {
      return response.badRequest(result.value)
    }

    return serialize({
      users: UserTransformer.transform(result.value),
    })
  }
}
