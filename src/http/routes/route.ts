import type { HttpContext } from '@adonisjs/core/http'

export type HttpMethod = 'get' | 'post' | 'put' | 'delete'

export const HttpMethods = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  DELETE: 'delete',
} as const

export interface Route {
  getHandler(): (ctx: HttpContext) => Promise<void>
  getPath(): string
  getMethod(): HttpMethod
  getSchema?: () => unknown
}
