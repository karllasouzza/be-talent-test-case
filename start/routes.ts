import router from '@adonisjs/core/services/router'
import authRoutes from '#http/routes/auth_routes'
import usersRoutes from '#http/routes/users_routes'
import selfRoutes from '#http/routes/self_routes'

router
  .group(() => {
    authRoutes()
    usersRoutes()
    selfRoutes()
  })
  .prefix('/api/v1')
