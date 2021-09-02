import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class AddCommissionPrivKeyRequestDTO {
  @ApiProperty({
    type: String,
    description: 'Commission private key',
    example: '56fcf4ead0853f4b19d9206e1dc6e3504bcf6d37746b309e446f620eaa88b506',
  })
  @IsString()
  @IsNotEmpty()
  commissionPrivKey: string

  num: number = 1
}
