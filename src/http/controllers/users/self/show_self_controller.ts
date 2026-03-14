import { type HttpContext } from '@adonisjs/core/http'
import UserTransformer from '#transformers/user_transformer'
import { Ability } from '#domain-users/role/ability'
import { type GetSelfUseCase } from '#application-users/use-cases/self/get_self_use_case'

export class ShowSelfController {
  constructor(private readonly useCase: GetSelfUseCase) {}

  private checkPermissions(auth: HttpContext['auth']): boolean {
    return auth.user!.currentAccessToken?.allows(Ability.SELF_READ) ?? false
  }

  async handler({ auth, serialize, response }: HttpContext) {
    if (!this.checkPermissions(auth)) {
      return response.forbidden(`Token lacks ${Ability.SELF_READ} ability`)
    }

    const result = await this.useCase.execute(auth.getUserOrFail())

    if (result.isLeft()) return response.notFound(result.value.message)

    return response.ok(serialize({ user: UserTransformer.transform(result.value) }))
  }
}
