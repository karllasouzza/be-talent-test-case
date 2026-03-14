import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'

export default function registerSelfRoutes() {
  router
    .group(() => {
      router.get('/', [controllers.Self, 'show'])
    })
    .prefix('self')
    .as('self')
    .use(middleware.auth())
}
