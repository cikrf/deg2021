import { TransformationType } from 'class-transformer/enums';

export function serverDateTransform(value: any, plain?: any, type?: TransformationType): any {
  if (!value) {
    return;
  }

  if (value instanceof Date) {
    return value;
  } else if (typeof value === 'string') {
    return new Date(String(value).replace(' ', 'T'));
  } else {
    return new Date(value);
  }
}
