import { type HttpContext } from '@adonisjs/core/http'
import { Ability } from '#domain-users/role/ability'
import { type DeleteSelfUseCase } from '#application-users/use-cases/self/delete_self_use_case'

export class DeleteSelfController {
  constructor(private readonly useCase: DeleteSelfUseCase) {}

  private checkPermissions(auth: HttpContext['auth']): boolean {
    return auth.user!.currentAccessToken?.allows(Ability.SELF_DELETE) ?? false
  }

  async handler({ auth, serialize, response }: HttpContext) {
    if (!this.checkPermissions(auth)) {
      return response.unauthorized("You don't have permission for this action")
    }

    const result = await this.useCase.execute(auth.getUserOrFail())

    if (result.isLeft()) {
      return response.internalServerError(result.value.message)
    }

    return serialize(result.value)
  }
}
