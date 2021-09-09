import * as yauzl from 'yauzl'
import { createWriteStream } from 'fs'
import { basename, resolve } from 'path'
import { glob } from 'glob'
import * as rimraf from 'rimraf'

export const unpackFile = async (filename: string, outputDir: string) => {
  return new Promise((resolve, reject) => {
    yauzl.open(filename, { lazyEntries: true }, (err, zipfile) => {
        if (err) return reject(err)
        zipfile!.readEntry()
        zipfile!.on('entry', (entry) => {
          if (!/\/$/.test(entry.fileName)) {
            const unpackedFilename = `${outputDir}/${basename(entry.fileName)}`
            const writeStream = createWriteStream(unpackedFilename)
            zipfile!.openReadStream(entry, (err, readStream) => {
              if (err) return reject(err)

              readStream!.on('end', () => {
                zipfile!.readEntry()
                writeStream.end()
              })

              readStream!.pipe(writeStream)
            })
          }
        })
        zipfile!.on('end', resolve)
      },
    )

  })
}

export const unpack = async (filename: string, tmpDir: string) => {
  await unpackFile(filename, tmpDir)
  const chunks = await new Promise<string[]>((res, rej) => {
    glob(resolve(tmpDir, '*.zip'), (err, result) => {
      if (err) {
        return rej(err)
      }
      res(result)
    })
  })

  for (filename of chunks) {
    await unpackFile(filename, tmpDir)
    rimraf.sync(filename)
  }
}
