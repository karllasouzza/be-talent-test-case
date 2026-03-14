import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'

export default function registerAuthRoutes() {
  router
    .group(() => {
      router.post('signup', [controllers.users.auth.SignIn, 'handler'])
      router.post('login', [controllers.users.auth.SignUp, 'handler'])
      router.delete('logout', [controllers.users.auth.SignOut, 'handler']).use(middleware.auth())
    })
    .prefix('auth')
    .as('auth')
}
