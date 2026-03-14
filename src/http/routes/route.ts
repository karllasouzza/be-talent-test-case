import type { HttpContext } from '@adonisjs/core/http'
import router from '@adonisjs/core/services/router'

export type HttpMethod = 'get' | 'post' | 'put' | 'delete'

export const HttpMethods = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  DELETE: 'delete',
} as const

export interface Route {
  name: string
  method: HttpMethod
  path: string
  handler: (ctx: HttpContext) => Promise<unknown>
  middleware?: Parameters<ReturnType<typeof router.get>['use']>
}

export function registerRoutes(routes: Route[]) {
  for (const route of routes) {
    const r = router[route.method](route.path, route.handler).as(route.name)
    if (route.middleware) r.use(...route.middleware)
  }
}
