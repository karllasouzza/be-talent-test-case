import User from '../../infrastructure/persistence/lucid/models/user.ts'
import { deleteUserValidator, signupValidator } from '../validators/users.ts'
import type { HttpContext } from '@adonisjs/core/http'
import UserTransformer from '../transformers/user_transformer.ts'
import { CreateUserUseCase } from '../../application/users/use-cases/management/create_user_use_case.ts'

export default class UsersController {
  async showAll({ auth, serialize }: HttpContext) {
    const users = await User.query().whereNot('id', auth.user!.id)
    const usersTransformed = users.map((user) => UserTransformer.transform(user))

    return serialize(usersTransformed)
  }

  async update({ auth, request, serialize }: HttpContext) {
    const user = auth.getUserOrFail()
    const { fullName, email } = request.only(['fullName', 'email'])

    user.merge({ fullName, email })
    await user.save()

    return serialize(UserTransformer.transform(user))
  }

  async delete({ request, serialize }: HttpContext) {
    const { id } = await request.validateUsing(deleteUserValidator)
    const user = await User.findOrFail(id)
    await user.delete()

    return serialize({
      message: 'Account deleted successfully',
    })
  }
}
