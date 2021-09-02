import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString } from 'class-validator'

export class ErrorResDTO {
  @ApiProperty({ required: false, example: 'Request failed' })
  @IsString()
  errorMsg: string

  @ApiProperty({ required: false, example: 0 })
  @IsNumber()
  errorCode: number

}
