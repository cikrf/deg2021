import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common'
import { Request } from 'express'
import { Observable } from 'rxjs'

export class BodyModifierInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    const req: Request = context.switchToHttp().getRequest()
    for (const paramKey in req.params) {
      req.body[paramKey] = req.params[paramKey]
    }
    return next.handle()
  }
}
