import { ApiProperty } from '@nestjs/swagger'
import { IsHexadecimal, IsString, Length } from 'class-validator'

export class RecoverPollRequestDTO {
  @ApiProperty({ example: 'CN8SztmeHFXPg2ad4DovM4LnguAMpyWDhSAQ1SSRSjAN' })
  @IsString()
  @Length(43, 44)
  txId: string

  @ApiProperty({ example: '4a546601fc676d976a790750c62780daf0fd33f20b6bf90215bb07037a654caf5f2cc5724f0026c10f2e432cacd1d801c38504e122e75bed' })
  @IsString()
  @IsHexadecimal()
  @Length(112, 112)
  privateKey: string

  @ApiProperty({ example: 'secret' })
  @IsString()
  secret: string

}
