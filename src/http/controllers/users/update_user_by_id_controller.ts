import UserTransformer from '#transformers/user_transformer'
import { type HttpContext } from '@adonisjs/core/http'
import { updateUserValidator } from '#validators/users'
import { Ability } from '../../../domain/users/role/ability.ts'
import { UnauthorizedError } from '../../../core/errors/unauthorized_error.ts'
import { type UpdateUserByIdUseCase } from '../../../application/users/use-cases/management/update_user_by_id_use_case.ts'

export default class UpdateUserByIdController {
  constructor(private readonly useCase: UpdateUserByIdUseCase) {}

  private checkPermissions(auth: HttpContext['auth']) {
    if (!auth.user!.currentAccessToken?.allows(Ability.USERS_UPDATE)) {
      return false
    }
    return true
  }

  async handler({ request, serialize, auth, response }: HttpContext) {
    if (!this.checkPermissions(auth)) {
      return response.unauthorized(new UnauthorizedError())
    }

    const { id, fullName, email, password, role } = await request.validateUsing(updateUserValidator)

    const result = await this.useCase.execute({ id, fullName, email, password, role })

    if (result.isLeft()) {
      return response.badRequest(result.value)
    }

    return serialize({
      user: UserTransformer.transform(result.value),
    })
  }
}
