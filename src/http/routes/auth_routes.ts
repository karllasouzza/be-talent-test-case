import router from '@adonisjs/core/services/router'
import db from '@adonisjs/lucid/services/db'
import { middleware } from '#start/kernel'
import { SignInController } from '#http/controllers/users/auth/sign_in_controller'
import { SignOutController } from '#http/controllers/users/auth/sign_out_controller'
import { SignUpController } from '#http/controllers/users/auth/sign_up_controller'
import { SignInUseCase } from '#application-users/use-cases/auth/sign_in_use_case'
import { SignOutUseCase } from '#application-users/use-cases/auth/sign_out_use_case'
import { SignUpUseCase } from '#application-users/use-cases/auth/sign_up_use_case'
import { UsersRepositoryLucid } from '#infrastructure/persistence/lucid/repositories/user_repositories_lucid'
import { TokenRepositoryLucid } from '#infrastructure/persistence/lucid/repositories/token_repository_lucid'
import { type Route, registerRoutes } from './route.js'

export default function authRoutes() {
  const usersRepo = new UsersRepositoryLucid(db)
  const tokenRepo = new TokenRepositoryLucid(db)

  const signIn = new SignInController(new SignInUseCase(usersRepo, tokenRepo))
  const signUp = new SignUpController(new SignUpUseCase(usersRepo, tokenRepo))
  const signOut = new SignOutController(new SignOutUseCase(tokenRepo))

  const routes: Route[] = [
    { name: 'sign_in', method: 'post', path: 'signup', handler: (ctx) => signIn.handler(ctx) },
    { name: 'sign_up', method: 'post', path: 'login', handler: (ctx) => signUp.handler(ctx) },
    {
      name: 'sign_out',
      method: 'delete',
      path: 'logout',
      handler: (ctx) => signOut.handler(ctx),
      middleware: [middleware.auth()],
    },
  ]

  router
    .group(() => registerRoutes(routes))
    .prefix('auth')
    .as('auth')
}
