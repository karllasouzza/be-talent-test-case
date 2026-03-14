import { type HttpContext } from '@adonisjs/core/http'
import { deleteUserValidator } from '#validators/users'
import { Ability } from '#domain-users/role/ability'
import { UnauthorizedError } from '#core/errors/unauthorized_error'
import { type DeleteUserByIdUseCase } from '#application-users/use-cases/management/delete_user_by_id_use_case'

export default class DeleteUserByIdController {
  private constructor(private readonly useCase: DeleteUserByIdUseCase) {}

  private checkPermissions(auth: HttpContext['auth']) {
    if (!auth.user!.currentAccessToken?.allows(Ability.USERS_DELETE)) {
      return false
    }
    return true
  }

  public async handler({ request, auth, response }: HttpContext) {
    if (!this.checkPermissions(auth)) {
      return response.unauthorized(new UnauthorizedError())
    }

    const { id } = await request.validateUsing(deleteUserValidator)

    const result = await this.useCase.execute(id)

    if (result.isLeft()) {
      return response.badRequest(result.value)
    }

    return response.ok({})
  }
}
