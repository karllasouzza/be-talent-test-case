import { type HttpContext } from '@adonisjs/core/http'
import { signInValidator } from '#validators/auth'
import User from '#models/user'
import { RoleAbilitiesService } from '../../../domain/users/role/role_abilities_service.ts'
import UserTransformer from '#transformers/user_transformer'

export class SignInController {
  async handler({ request, serialize }: HttpContext) {
    const { email, password } = await request.validateUsing(signInValidator)

    const user = await User.verifyCredentials(email, password)
    const abilities = RoleAbilitiesService.for(user.typedRole)
    const token = await User.accessTokens.create(user, abilities)

    return serialize({
      user: UserTransformer.transform(user),
      token: token.value!.release(),
    })
  }
}
