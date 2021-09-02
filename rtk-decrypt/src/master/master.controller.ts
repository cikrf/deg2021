import { Body, Controller, Get, HttpException, Param, Post, Put, UseInterceptors } from '@nestjs/common'
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { LoggerService } from '../logger/logger.service'
import { BodyModifierInterceptor } from '../middlewares/body-modifier.interceptor'
import { CreatePollRequestDTO } from './dto/create-poll-req.dto'
import { CreateResponseDTO } from './dto/create-poll-res.dto'
import { MasterService } from './master.service'
import { LoggerInterceptor } from '../middlewares/logger.interceptor'
import { AddCommissionPubKeyRequestDTO } from './dto/add-commission-pub-key.dto'
import { ResponseDTO } from './dto/res.dto'
import { AddCommissionPrivKeyRequestDTO } from './dto/add-commission-priv-key.dto'
import { GetPollResponseDTO } from './dto/get-poll-resp.dto'
import { RabbitMQController, RabbitRPC } from '../rabbit-mq'
import { ErrorResDTO } from './dto/error-res.dto'
import { RecoverPollRequestDTO } from './dto/recover-poll-req.dto'
import { GetVotesStatDTO } from './dto/get-votes-stat.dto'
import { ConfigService } from 'src/config/config.service'

@RabbitMQController()
@ApiTags('Poll')
@UseInterceptors(LoggerInterceptor, BodyModifierInterceptor)
@Controller('/v1/poll')
export class MasterController {
  constructor(
    private readonly loggerService: LoggerService,
    // @ts-ignore
    private readonly configService: ConfigService, // mark as @ts-ignore because used within RabbitMQController class
    private readonly masterService: MasterService,
  ) {
    this.loggerService.setContext(MasterController.name)
  }

  private lock: Set<string> = new Set()

  @Get(':pollId')
  @ApiOperation({ operationId: 'getPoll', description: 'Get poll information' })
  @ApiOkResponse({ type: GetPollResponseDTO })
  @ApiBadRequestResponse({ type: ErrorResDTO })
  @RabbitRPC()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getPoll(@Body() request: { pollId: string }, @Param('pollId') _pollId: string) {
    try {
      return await this.masterService.getPoll({ pollId: request.pollId })
    } catch (err) {
      throw new HttpException(
        {
          message: err.message,
          errorCode: 'GET_POLL_ERROR',
        },
        err.status || 400,
      )
    }
  }

  @Post('')
  @ApiOperation({ operationId: 'createPoll', description: 'Create poll' })
  @ApiCreatedResponse({ type: CreateResponseDTO })
  @ApiBadRequestResponse({ type: ErrorResDTO })
  @RabbitRPC({ dto: CreatePollRequestDTO })
  async createPoll(@Body() request: CreatePollRequestDTO) {
    try {
      this.acquireLock(request.pollId)
      const contractId = await this.masterService.createPoll(request)
      return {
        pollId: request.pollId,
        txId: contractId,
      }
    } catch (err) {
      throw new HttpException(
        {
          message: err.message,
          errorCode: 'CREATE_POLL_ERROR',
        },
        err.status || 400,
      )
    } finally {
      this.releaseLock(request.pollId)
    }
  }

  @Put(':pollId/addCommissionPubKey')
  @ApiOperation({ operationId: 'addCommissionPubKey', description: 'Add commission public key' })
  @ApiOkResponse({ type: ResponseDTO })
  @ApiBadRequestResponse({ type: ErrorResDTO })
  @RabbitRPC({ dto: AddCommissionPubKeyRequestDTO })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async addCommissionPubKey(@Body() request: AddCommissionPubKeyRequestDTO, @Param('pollId') _pollId: string) {
    const { pollId } = request as AddCommissionPubKeyRequestDTO & { pollId: string }
    try {
      this.acquireLock(pollId)
      await this.masterService.addCommissionPubKey(request)
      return {
        result: 'completed',
      }
    } catch (err) {
      throw new HttpException(
        {
          message: err.message,
          errorCode: 'ADD_COMMISSION_PUB_KEY_ERROR',
        },
        err.status || 400,
      )
    } finally {
      this.releaseLock(pollId)
    }
  }

  @Put(':pollId/start')
  @ApiOperation({ operationId: 'startPoll', description: 'Send start vote transaction' })
  @ApiOkResponse({ type: ResponseDTO })
  @ApiBadRequestResponse({ type: ErrorResDTO })
  @RabbitRPC()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async start(@Body() request: { pollId: string }, @Param('pollId') _pollId: string) {
    const { pollId } = request as AddCommissionPubKeyRequestDTO & { pollId: string }
    try {
      this.acquireLock(pollId)
      await this.masterService.startVoting(pollId)
      return {
        result: 'completed',
      }
    } catch (err) {
      throw new HttpException(
        {
          message: err.message,
          errorCode: 'START_POLL_ERROR',
        },
        err.status || 400,
      )
    } finally {
      this.releaseLock(pollId)
    }
  }

  @Put(':pollId/finalize')
  @ApiOperation({ operationId: 'finalizePoll', description: 'Finalize poll' })
  @ApiOkResponse({ type: ResponseDTO })
  @ApiBadRequestResponse({ type: ErrorResDTO })
  @RabbitRPC()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async finalizePoll(@Body() request: { pollId: string }, @Param('pollId') _pollId: string) {
    const { pollId } = request as AddCommissionPubKeyRequestDTO & { pollId: string }
    try {
      this.acquireLock(pollId)
      await this.masterService.finalizePoll(pollId)
      return {
        result: 'completed',
      }
    } catch (err) {
      throw new HttpException(
        {
          message: err.message,
          errorCode: 'FINALIZE_POLL_ERROR',
        },
        err.status || 400,
      )
    } finally {
      this.releaseLock(pollId)
    }
  }

  @Put(':pollId/addCommissionPrivKey')
  @ApiOperation({ operationId: 'addCommissionPrivKey', description: 'Add commission private key' })
  @ApiOkResponse({ type: ResponseDTO })
  @ApiBadRequestResponse({ type: ErrorResDTO })
  @RabbitRPC({ dto: AddCommissionPrivKeyRequestDTO })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async addCommissionPrivKey(@Body() request: AddCommissionPrivKeyRequestDTO, @Param('pollId') _pollId: string) {
    const { pollId } = request as AddCommissionPrivKeyRequestDTO & { pollId: string }
    try {
      this.acquireLock(pollId)
      await this.masterService.addCommissionPrivKey(request)
      return {
        result: 'completed',
      }
    } catch (err) {
      throw new HttpException(
        {
          message: err.message,
          errorCode: 'ADD_COMMISSION_PRIV_KEY_ERROR',
        },
        err.status || 400,
      )
    } finally {
      this.releaseLock(pollId)
    }
  }

  @Post('recover')
  @ApiOperation({ operationId: 'recoverPoll', description: 'Recover poll on backup master-service' })
  @ApiCreatedResponse({ type: ResponseDTO })
  @ApiBadRequestResponse({ type: ErrorResDTO })
  async recoverPoll(@Body() request: RecoverPollRequestDTO) {
    try {
      const pollId = await this.masterService.recoverPoll(request)
      return {
        pollId,
        txId: request.txId,
      }
    } catch (err) {
      throw new HttpException(
        {
          message: err.message,
          errorCode: 'RECOVER_POLL_ERROR',
        },
        err.status || 400,
      )
    }
  }

  @Get(':pollId/votesStat')
  @ApiOperation({ operationId: 'votesStat', description: 'Full votes summary' })
  @ApiCreatedResponse({ type: GetVotesStatDTO })
  @ApiBadRequestResponse({ type: ErrorResDTO })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async votesStat(@Body() request: { pollId: string }, @Param('pollId') _pollId: string) {
    try {
      return await this.masterService.votesStat(request.pollId)
    } catch (err) {
      throw new HttpException(
        {
          message: err.message,
          errorCode: 'VOTES_STAT_ERROR',
        },
        err.status || 400,
      )
    }
  }

  isNotLocked(id: string) {
    if (this.lock.has(id)) {
      throw new Error('Wait for lock release')
    }
  }

  acquireLock(id: string) {
    this.isNotLocked(id)
    this.lock.add(id)
  }

  releaseLock(id: string) {
    this.lock.delete(id)
  }

}
