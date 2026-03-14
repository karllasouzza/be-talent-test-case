import router from '@adonisjs/core/services/router'
import db from '@adonisjs/lucid/services/db'
import { middleware } from '#start/kernel'
import { ShowSelfController } from '#http/controllers/users/self/show_self_controller'
import { UpdateSelfController } from '#http/controllers/users/self/update_self_controller'
import { DeleteSelfController } from '#http/controllers/users/self/delete_self_controller'
import { GetSelfUseCase } from '#application-users/use-cases/self/get_self_use_case'
import { UpdateSelfUseCase } from '#application-users/use-cases/self/update_self_use_case'
import { DeleteSelfUseCase } from '#application-users/use-cases/self/delete_self_use_case'
import { UsersRepositoryLucid } from '#infrastructure/persistence/lucid/repositories/user_repositories_lucid'
import { type Route, registerRoutes } from './route.js'

export default function selfRoutes() {
  const usersRepo = new UsersRepositoryLucid(db)

  const show = new ShowSelfController(new GetSelfUseCase(usersRepo))
  const update = new UpdateSelfController(new UpdateSelfUseCase(usersRepo))
  const del = new DeleteSelfController(new DeleteSelfUseCase(usersRepo))

  const protectedRoutes: Route[] = [
    { name: 'show', method: 'get', path: '/', handler: (ctx) => show.handler(ctx) },
    { name: 'update', method: 'put', path: '/', handler: (ctx) => update.handler(ctx) },
    { name: 'delete', method: 'delete', path: '/', handler: (ctx) => del.handler(ctx) },
  ]

  router
    .group(() => registerRoutes(protectedRoutes))
    .prefix('self')
    .as('self_auth')
    .use(middleware.auth())
}
