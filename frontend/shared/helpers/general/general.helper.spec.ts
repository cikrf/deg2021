import { isNullish } from './general.helper';

describe('General helper', () => {
  it('isNullish', () => {
    expect(isNullish('')).toEqual(false);
    expect(isNullish('123')).toEqual(false);
    expect(isNullish(123)).toEqual(false);
    expect(isNullish({ a: 1 })).toEqual(false);
    expect(isNullish(true)).toEqual(false);
    expect(isNullish(false)).toEqual(false);

    expect(isNullish(null)).toEqual(true);
    expect(isNullish(undefined)).toEqual(true);
  });
});
