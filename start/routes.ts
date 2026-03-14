import router from '@adonisjs/core/services/router'
import registerAuthRoutes from '#http/routes/auth_routes'
import registerUsersRoutes from '#http/routes/users_routes'
import registerSelfRoutes from '#http/routes/self_routes'

router
  .group(() => {
    registerAuthRoutes()
    registerUsersRoutes()
    registerSelfRoutes()
  })
  .prefix('/api/v1')
