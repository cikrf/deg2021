import { TargetOptions } from '@angular-builders/custom-webpack';

export default (targetOptions: TargetOptions, indexHtml: string): string => {
  return indexHtml.replace(/<script.*?src=".*?\.js".*?<\/script>/g, '');
};
