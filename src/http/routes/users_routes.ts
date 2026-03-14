import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'

export default function registerUsersRoutes() {
  router
    .group(() => {
      router.get('/', [controllers.users.management.GetManyUsers, 'handler'])
      router.post('/', [controllers.users.management.CreateUser, 'handler'])
      router.put('/:id', [controllers.users.management.UpdateUserById, 'handler'])
      router.delete('/:id', [controllers.users.management.DeleteUserById, 'handler'])
    })
    .prefix('users')
    .as('users')
    .use(middleware.auth())
}
