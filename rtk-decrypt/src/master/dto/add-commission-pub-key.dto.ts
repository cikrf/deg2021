import { ApiProperty } from '@nestjs/swagger'
import { IsHexadecimal, IsNotEmpty } from 'class-validator'

export class AddCommissionPubKeyRequestDTO {
  @ApiProperty({
    type: String,
    description: 'Commission public key (compressed point hex)',
    example: '03f6c599d3f275cf217ea0eb182d756ce6e86e385ee487641f750c30dac51c19ef',
  })
  @IsNotEmpty()
  @IsHexadecimal()
  commissionPubKey: string
}
