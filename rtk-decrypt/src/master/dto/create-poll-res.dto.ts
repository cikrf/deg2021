import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class CreateResponseDTO {
  @ApiProperty({ example: '134f135f1vg25g15g135g13' })
  @IsString()
  pollId: string

  @ApiProperty({ example: 'f234f8174fh71o48fho147fho1943hfo134fh' })
  @IsString()
  txId: string
}
