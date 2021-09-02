import { Controller, Get } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { ConfigService } from '../config/config.service'
import { ProbeDto, StatusDto } from './dto'

@Controller()
@ApiTags('Probes')
export class AppController {
  constructor(private readonly configService: ConfigService) {}

  @Get('status')
  @ApiOperation({ operationId: 'getStatus', description: 'Status endpoint' })
  @ApiOkResponse({ type: StatusDto })
  getStatus() {
    return { status: 'OK', ...this.configService.getVersionInfo() }
  }

  @Get('livenessProbe')
  @ApiOperation({ operationId: 'livenessProbe', description: 'Liveness probe endpoint' })
  @ApiOkResponse({ type: ProbeDto })
  livenessProbe() {
    return { time: Date.now() }
  }

  @Get('readinessProbe')
  @ApiOperation({ operationId: 'readinessProbe', description: 'Readiness probe endpoint' })
  @ApiOkResponse({ type: ProbeDto })
  readinessProbe() {
    return { time: Date.now() }
  }
}
