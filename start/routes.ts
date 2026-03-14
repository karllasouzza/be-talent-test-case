import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

router
  .group(() => {
    router
      .group(() => {
        router.post('signup', [controllers.users.auth.SignIn, 'handler'])
        router.post('login', [controllers.users.auth.SignUp, 'handler'])
        router.delete('logout', [controllers.users.auth.SignOut, 'handler']).use(middleware.auth())
      })
      .prefix('auth')
      .as('auth')

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

    router
      .group(() => {
        router.get('/', [controllers.Self, 'show'])
      })
      .prefix('self')
      .as('self')
      .use(middleware.auth())
  })
  .prefix('/api/v1')
