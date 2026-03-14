import UserTransformer from "#transformers/user_transformer"
import { HttpContext } from "@adonisjs/core/http"
import { GetSelfUseCase } from "../../../../application/users/use-cases/self/get_self_use_case.ts"

export class ShowSelfController {
  constructor(private readonly useCase: GetSelfUseCase) {}

  async handle(ctx: HttpContext) {
    const user = ctx.auth.user!

    const result = this.useCase.execute(user)

    return ctx.response.ok({
      data: UserTransformer.transform(result),
    })
  }
}
