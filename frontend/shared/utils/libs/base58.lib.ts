const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const ALPHABET_MAP = ALPHABET.split('').reduce((map, c, i) => {
  // @ts-ignore
  map[c] = i;
  return map;
}, {});

export default {
  encode(buffer: Uint8Array | number[]): string {
    if (!buffer.length) {
      return '';
    }
    const digits = [0];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < buffer.length; i++) {
      for (let j = 0; j < digits.length; j++) {
        // tslint:disable-next-line:no-bitwise
        digits[j] <<= 8;
      }
      digits[0] += buffer[i];
      let carry = 0;
      for (let k = 0; k < digits.length; k++) {
        digits[k] += carry;
        // tslint:disable-next-line:no-bitwise
        carry = (digits[k] / 58) | 0;
        digits[k] %= 58;
      }
      while (carry) {
        digits.push(carry % 58);
        // tslint:disable-next-line:no-bitwise
        carry = (carry / 58) | 0;
      }
    }
    for (let i = 0; buffer[i] === 0 && i < buffer.length - 1; i++) {
      digits.push(0);
    }
    return digits.reverse().map((digit: number) => {
      return ALPHABET[digit];
    }).join('');
  },

  decode(str: string = ''): Uint8Array {
    if (!str.length) {
      return new Uint8Array(0);
    }
    const bytes = [0];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < str.length; i++) {
      const c = str[i];
      if (!(c in ALPHABET_MAP)) {
        throw new Error(`There is no character "${c}" in the Base58 sequence!`);
      }
      for (let j = 0; j < bytes.length; j++) {
        bytes[j] *= 58;
      }
      // @ts-ignore
      bytes[0] += ALPHABET_MAP[c];
      let carry = 0;
      for (let j = 0; j < bytes.length; j++) {
        bytes[j] += carry;
        // tslint:disable-next-line:no-bitwise
        carry = bytes[j] >> 8;
        // tslint:disable-next-line:no-bitwise
        bytes[j] &= 0xff;
      }
      while (carry) {
        // tslint:disable-next-line:no-bitwise
        bytes.push(carry & 0xff);
        // tslint:disable-next-line:no-bitwise
        carry >>= 8;
      }
    }
    for (let i = 0; str[i] === '1' && i < str.length - 1; i++) {
      bytes.push(0);
    }
    return new Uint8Array(bytes.reverse());
  }
};
