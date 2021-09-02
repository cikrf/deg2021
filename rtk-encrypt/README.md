# Usage example


### Generate and encrypt one bulletin
```js

// generator settings
const bulletinsNum = 1
const questionsNum = 3
const optionsNum = 8
const maxSelected = 4
const minSelected = 0

const bulletins = Array(bulletinsNum)
  .fill(0)
  .map(() => Array(questionsNum)
    .fill(0)
    .map(() => {
      const selected = minSelected + Math.round(Math.random() * maxSelected - minSelected)
      return [
        ...Array(selected).fill(1),
        ...Array(optionsNum - selected).fill(0)
      ].sort(() => Math.random() - 0.5)
    })
  )


/*
 *  [
 *    {
 *      min: number,      // minimum amount of selected options
 *      max: number,      // maximum amount of selected options
 *      options: number   // total options num in question
 *    },
 *    ..
 *  ]
 */
const dimension = Array(questionsNum)
  .fill(0)
  .map((_, i) => ({
    min: minSelected,
    max: maxSelected,
    options: bulletins[0][i].length
  }))

const encryptOptions = {
  mainKey,                  // hex string
  dimension,               // [{min: 0, max: 2, options: 3}]
  bulletin: bulletins[0],   // whole bulletin (ex. [[0,1,0]])
}

const encrypted = encrypt(encryptOptions)
/// ...
```

### Encode to bytes / Decode from bytes
```js
// ...
const encrypted = encrypt(encryptOptions)
const binary = encode(encrypted)
const decoded = decode(binary)
console.log(`Binary size: ${binary.length}`)
```

# Changelog

## v1.2.0-RC1
- GOST curve & hash

## v1.0.0-RC2
- removed **config** param
- moved to seckp256k1 lib with fallback elliptic.js
- removed **compact** flag

## v0.9.1-RC7
- **config.basePoint** renamed to **config.base**
- **config.base** format - hex string
- **mainKey** format - hex string
- removed **config.padersenBase**
- added **compact** param for encrypt()
