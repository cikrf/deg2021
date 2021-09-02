import { registerDecorator, ValidationOptions } from 'class-validator'
import { CreatePollRequestDTO } from '../master/dto/create-poll-req.dto'
import { GetPollResponseDTO } from '../master/dto/get-poll-resp.dto'

export function IsDimension() {
  return function (object: CreatePollRequestDTO | GetPollResponseDTO, propertyName: string) {
    registerDecorator({
      name: 'isDimension',
      target: object.constructor,
      propertyName,
      options: {
        message: `wrong ${propertyName} format`,
      } as ValidationOptions,
      validator: {
        validate(value: unknown) {
          const validType = (
            Array.isArray(value) &&
            value.length > 0 &&
            value.every((el) => Array.isArray(el) && el.every(isFinite))
          )
          if (!validType) {
            return false
          }
          const validData = Array.isArray(value) && value.every((el: number[]) => {
            // !(min > max)
            if (el[0] > el[1]) {
              return false
            }
            // all items positive or zero
            if (!el.every((v) => v >= 0)) {
              return false
            }
            // min less than total, max less or equal than total
            return el[0] < el[2] && el[1] <= el[2]
          })
          return validType && validData
        },
      },
    })
  }
}
