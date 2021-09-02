import { ApiProperty } from '@nestjs/swagger'
import { IsHexadecimal, IsString, MinLength } from 'class-validator'
import { IsDimension } from '../../utils/is-dimension'

export class CreatePollRequestDTO {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsString()
  @MinLength(1)
  pollId: string

  @ApiProperty({
    type: String,
    description: 'Blind signature modulo',
    example: '9514e5ea64baaa5d7abcd3d8dd98fb096ae7f23e30daecee2fc4b3b447d53e93e72724bc5c56d8937d965a3427005f30cc87926213d02dc8b9467b00a85e636c551e6e3a04c1f4374e40a60bdc5c596e5901b73de953f1db453ab0912051a0655e91701fdbc6a8f082185fc9957d973d51afc0963528e34e3302b8d61d245407c12f702e322f828720047f160bced9ce6edfc1fd7ced20e69c88d49a69d4f6da3f985eee2b4c17454b2d0dc415cba607c137143dd7c0ebaff2f4397aabd4588b9d1012d51c529567e26f4856f0b03ea9f266aa689cfea619fe5513f886597cd66693db3dd33e647917147cd288ddff254eb0dfcdbedda5a00ed16eae77e622cff154345bbe8603b1118ea9899b0a0fec0d023b94ea45773902445745aaba64ea3f3ae0513bfff4d9cb0376168639e923151a953e611148d73bd404d4f4c76e71a64df9fc1ab5ea6d2c6123f513e082723e3c4c3ed7c13958652c8f5c367eb8a85787c5aa76c5046c26e65e58a33153f9666324a4bee4972730b98f0f3393d7b204c6bf713a2fd6ef232b0f6d70f5ee5b1349e2a797ce85b98d56715339f1df9acfe4264b267b3f04d8d4be4258ee9026c7da526f848fbccd8709d6734ce295b90ef1e938f35164b8c172e331cc3936740144c79f9eb0b1c85b6be8c02677414c4bde15e62f647cbd61c5a8c6935367f0f0e450bcaabe84fbe78d2b8595c6257d',
  })
  @IsHexadecimal()
  @IsString()
  blindSigModulo: string

  @ApiProperty({
    type: String,
    description: 'Blind signature exponent',
    example: '10001',
  })
  @IsString()
  @IsHexadecimal()
  blindSigExponent: string

  @ApiProperty({ example: '5ec3f6a79frgwqgrgeetqgd339d4d135f3dba' })
  @IsString()
  @MinLength(1)
  bulletinHash: string

  @ApiProperty({
    required: true,
    type: 'array',
    items: {
      type: 'array',
      items: {
        type: 'number',
      },
    },
    example: [[1, 1, 8]],
  })
  @IsDimension()
  dimension: number[][]

  @ApiProperty({ example: '883ZWFJJRgfXptL4Qa1CuDgwjb9Wioepzmk5auBM46fjevRNpw6JpeEsj837ZKmroEJ359vT3LErfDno4WKwsPm' })
  @IsString()
  @MinLength(1)
  votersListRegistrator: string

  @ApiProperty({ example: '883ZWFJJRgfXptL4Qa1CuDgwjb9Wioepzmk5auBM46fjevRNpw6JpeEsj837ZKmroEJ359vT3LErfDno4WKwsPm' })
  @IsString()
  @MinLength(1)
  blindSigIssueRegistrator: string

  @ApiProperty({ example: '883ZWFJJRgfXptL4Qa1CuDgwjb9Wioepzmk5auBM46fjevRNpw6JpeEsj837ZKmroEJ359vT3LErfDno4WKwsPm' })
  @IsString()
  @MinLength(1)
  issueBallotsRegistrator: string

}
