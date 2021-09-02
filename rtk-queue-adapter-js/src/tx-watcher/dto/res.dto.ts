import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class ResponseDTO {
  @ApiProperty({
    type: Number,
    example: '2',
  })
  @IsString()
  result: string
}
