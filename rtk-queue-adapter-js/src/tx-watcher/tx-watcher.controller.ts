import { Controller, HttpException, Post, UseGuards, UseInterceptors } from '@nestjs/common'
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger'
import { LoggerService } from '../logger/logger.service'
import { LoggerInterceptor } from '../middlewares/logger.interceptor'
import { ResponseDTO } from './dto/res.dto'
import { ErrorResDTO } from './dto/error-res.dto'
import { TxWatcherService } from './tx-watcher.service'
import { StatResponseDTO } from './dto/stat-res.dto'
import { AuthGuard } from '@nestjs/passport'

@ApiTags('Tx Watcher')
@UseInterceptors(LoggerInterceptor)
@Controller('/v1')
@ApiSecurity('apiKey')
export class TxWatcherController {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly txWatcherService: TxWatcherService,
  ) {
    this.loggerService.setContext(TxWatcherController.name)
  }

  @Post('rebroadcast')
  @UseGuards(AuthGuard('apiKey'))
  @ApiOperation({ operationId: 'rebroadcast', description: 'Rebroadcast all broken transactions' })
  @ApiOkResponse({ type: ResponseDTO })
  @ApiBadRequestResponse({ type: ErrorResDTO })
  async rebroadcast() {
    try {
      return {
        result: await this.txWatcherService.rebroadcastAll(),
      }
    } catch (err) {
      throw new HttpException(
        {
          message: err.message,
          errorCode: 'REBROADCAST_ERROR',
        },
        err.status || 400,
      )
    }
  }

  @Post('stat')
  @UseGuards(AuthGuard('apiKey'))
  @ApiOperation({ operationId: 'stat', description: 'Get transactions stat' })
  @ApiOkResponse({ type: StatResponseDTO, isArray: true })
  @ApiBadRequestResponse({ type: ErrorResDTO })
  async stat() {
    try {
      return await this.txWatcherService.stat()
    } catch (err) {
      throw new HttpException(
        {
          message: err.message,
          errorCode: 'STAT_ERROR',
        },
        err.status || 400,
      )
    }
  }
}
