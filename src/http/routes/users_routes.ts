import router from '@adonisjs/core/services/router'
import db from '@adonisjs/lucid/services/db'
import { middleware } from '#start/kernel'
import CreateUserController from '#http/controllers/users/management/create_user_controller'
import DeleteUserByIdController from '#http/controllers/users/management/delete_user_by_id_controller'
import GetManyUsersController from '#http/controllers/users/management/get_many_users_controller'
import UpdateUserByIdController from '#http/controllers/users/management/update_user_by_id_controller'
import { CreateUserUseCase } from '#application-users/use-cases/management/create_user_use_case'
import { DeleteUserByIdUseCase } from '#application-users/use-cases/management/delete_user_by_id_use_case'
import { GetManyUsersUseCase } from '#application-users/use-cases/management/get_many_user_use_case'
import { UpdateUserByIdUseCase } from '#application-users/use-cases/management/update_user_by_id_use_case'
import { UsersRepositoryLucid } from '#infrastructure/persistence/lucid/repositories/user_repositories_lucid'
import { type Route, registerRoutes } from './route.js'

export default function usersRoutes() {
  const usersRepo = new UsersRepositoryLucid(db)

  const getMany = new GetManyUsersController(new GetManyUsersUseCase(usersRepo))
  const create = new CreateUserController(new CreateUserUseCase(usersRepo))
  const update = new UpdateUserByIdController(new UpdateUserByIdUseCase(usersRepo))
  const del = new DeleteUserByIdController(new DeleteUserByIdUseCase(usersRepo))

  const routes: Route[] = [
    { name: 'get_many', method: 'get', path: '/', handler: (ctx) => getMany.handler(ctx) },
    { name: 'create', method: 'post', path: '/', handler: (ctx) => create.handler(ctx) },
    { name: 'update', method: 'put', path: '/:id', handler: (ctx) => update.handler(ctx) },
    { name: 'delete', method: 'delete', path: '/:id', handler: (ctx) => del.handler(ctx) },
  ]

  router
    .group(() => registerRoutes(routes))
    .prefix('users')
    .as('users')
    .use(middleware.auth())
}
