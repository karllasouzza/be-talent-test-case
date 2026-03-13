import { signupValidator } from '../validators/users.ts'
import type { HttpContext } from '@adonisjs/core/http'
import UserTransformer from '../transformers/user_transformer.ts'
import { Ability } from '../../domain/users/role/index.ts'
import { updateSelfValidator } from '../validators/self.ts'
import { RegisterSelfUseCase } from '../../application/users/use-cases/self/register_self_use_case.ts'
import { GetSelfUseCase } from '../../application/users/use-cases/self/get_self_use_case.ts'
import { UpdateSelfUseCase } from '../../application/users/use-cases/self/update_self_use_case.ts'
import { InvalidOldPasswordError } from '../../core/errors/invalid_old_password_error.ts'
import { DeleteSelfUseCase } from '../../application/users/use-cases/self/delete_self_use_case.ts'

export default class SelfController {
  async store({ request, serialize }: HttpContext) {
    const { fullName, email, password } = await request.validateUsing(signupValidator)

    const result = await new RegisterSelfUseCase().execute({ fullName, email, password })

    if (result.isLeft()) {
      return serialize({ message: result.value.message })
    }

    const { user, token } = result.value

    return serialize({
      user: UserTransformer.transform(user),
      token: token.value!.release(),
    })
  }

  async show({ response, auth, serialize }: HttpContext) {
    if (!auth.user!.currentAccessToken?.allows(Ability.SELF_READ)) {
      return response.forbidden(`Token lacks ${Ability.SELF_READ} ability`)
    }

    const user = new GetSelfUseCase().execute(auth.getUserOrFail())

    return serialize(UserTransformer.transform(user))
  }

  async update({ auth, request, serialize, response }: HttpContext) {
    if (!auth.user!.currentAccessToken?.allows(Ability.SELF_UPDATE)) {
      return response.unauthorized("You don't have permission for this action")
    }

    const { fullName, newEmail, oldPassword, newPassword } =
      await request.validateUsing(updateSelfValidator)

    const result = await new UpdateSelfUseCase().execute({
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

  async delete({ auth, serialize, response }: HttpContext) {
    const result = await new DeleteSelfUseCase().execute(auth.getUserOrFail())

    if (result.isLeft()) {
      return response.internalServerError(result.value.message)
    }

    return serialize(result.value)
  }
}
