import { ApiProperty } from '@nestjs/swagger'
import { IsNumber } from 'class-validator'

export class GetVotesStatDTO {

  @ApiProperty({ example: 200 })
  @IsNumber()
  all: number

  @ApiProperty({ example: 200 })
  @IsNumber()
  unique: number

  @ApiProperty({ example: 50 })
  @IsNumber()
  fail: number

  @ApiProperty({ example: 50 })
  @IsNumber()
  success: number

  @ApiProperty({ example: 200 })
  @IsNumber()
  processed: number

  @ApiProperty({ example: { contract: 0, validation: 0 } })
  failsInfo?: {
    contract?: number,
    validation?: number,
  }

}
