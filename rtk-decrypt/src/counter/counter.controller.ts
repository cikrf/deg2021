import { Controller, HttpException, Post, UseInterceptors } from '@nestjs/common'
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { LoggerService } from '../logger/logger.service'
import { BodyModifierInterceptor } from '../middlewares/body-modifier.interceptor'
import { LoggerInterceptor } from '../middlewares/logger.interceptor'
import { ResponseDTO } from './dto/res.dto'
import { ErrorResDTO } from './dto/error-res.dto'
import { CounterService } from './counter.service'

@ApiTags('Common')
@UseInterceptors(LoggerInterceptor, BodyModifierInterceptor)
@Controller('/v1')
export class CounterController {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly counterService: CounterService,
  ) {
    this.loggerService.setContext(CounterController.name)
  }

  @Post('revalidate')
  @ApiOperation({ operationId: 'revalidate', description: 'Revalidate invalid bulletins' })
  @ApiOkResponse({ type: ResponseDTO })
  @ApiBadRequestResponse({ type: ErrorResDTO })
  async revalidate() {
    try {
      return await this.counterService.revalidate()
    } catch (err) {
      throw new HttpException(
        {
          message: err.message,
          errorCode: 'REVALIDATE_ERROR',
        },
        err.status || 400,
      )
    }
  }
}
