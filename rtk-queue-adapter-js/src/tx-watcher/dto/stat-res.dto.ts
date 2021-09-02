import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString } from 'class-validator'

export class StatResponseDTO {
  @ApiProperty({ example: 'SUCCESS' })
  @IsString()
  status: string

  @ApiProperty({ example: 'ALREADY_IN_THE_STATE' })
  @IsString()
  last_broadcast_error_status: string

  @ApiProperty({ example: '1' })
  @IsNumber()
  count: number
}
