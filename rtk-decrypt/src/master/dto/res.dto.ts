import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class ResponseDTO {
  @ApiProperty({
    type: String,
    example: 'completed',
  })
  @IsString()
  result: string
}
