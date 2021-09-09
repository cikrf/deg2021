import { glob } from 'glob'

export const getFiles = (mask: string): Promise<string[]> => {
  return new Promise<string[]>((res, rej) => {
    glob(mask, (err, result) => {
      if (err) {
        return rej(err)
      }
      res(result)
    })
  })
}
