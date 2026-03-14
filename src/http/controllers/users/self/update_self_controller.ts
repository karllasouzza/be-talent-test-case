import { type HttpContext } from '@adonisjs/core/http'
import UserTransformer from '#transformers/user_transformer'
import { Ability } from '#domain-users/role/ability'
import { updateSelfValidator } from '#validators/self'
import { type UpdateSelfUseCase } from '#application-users/use-cases/self/update_self_use_case'
import { InvalidOldPasswordError } from '#core/errors/invalid_old_password_error'

export class UpdateSelfController {
  constructor(private readonly useCase: UpdateSelfUseCase) {}

  private checkPermissions(auth: HttpContext['auth']): boolean {
    return auth.user!.currentAccessToken?.allows(Ability.SELF_UPDATE) ?? false
  }

  async handler({ auth, request, serialize, response }: HttpContext) {
    if (!this.checkPermissions(auth)) {
      return response.unauthorized("You don't have permission for this action")
    }

    const { fullName, newEmail, oldPassword, newPassword } =
      await request.validateUsing(updateSelfValidator)

    const result = await this.useCase.execute({
      user: auth.getUserOrFail(),
      fullName,
      newEmail,
      oldPassword,
      newPassword,
    })

    if (result.isLeft()) {
      if (result.value instanceof InvalidOldPasswordError) {
        return response.badRequest(result.value.message)
      }
      return response.internalServerError(result.value.message)
    }

    return serialize(UserTransformer.transform(result.value.user))
  }
}
