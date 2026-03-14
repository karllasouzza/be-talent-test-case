import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

router
  .group(() => {
    router
      .group(() => {
        router.post('signup', [controllers.Self, 'store'])
        router.post('login', [controllers.AccessToken, 'store'])
        router.delete('logout', [controllers.AccessToken, 'destroy']).use(middleware.auth())
      })
      .prefix('auth')
      .as('auth')

    router
      .group(() => {
        router.get('/', [controllers.users.GetManyUsers, 'handler'])
        router.post('/', [controllers.users.CreateUser, 'handler'])
        router.put('/:id', [controllers.users.UpdateUserById, 'handler'])
        router.delete('/:id', [controllers.users.DeleteUserById, 'handler'])
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
