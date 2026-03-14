import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { ShowSelfController } from '#http/controllers/users/self/show_self_controller'
import { GetSelfUseCase } from '#application-users/use-cases/self/get_self_use_case'
import { type Route, registerRoutes } from './route.js'

export default function selfRoutes() {
  const show = new ShowSelfController(new GetSelfUseCase())

  const routes: Route[] = [
    { name: 'show', method: 'get', path: '/', handler: (ctx) => show.handle(ctx) },
  ]

  router
    .group(() => registerRoutes(routes))
    .prefix('self')
    .as('self')
    .use(middleware.auth())
}
