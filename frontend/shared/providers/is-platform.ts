import { InjectionToken, PLATFORM_ID, Provider } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';


export const APP_IS_PLATFORM_BROWSER = new InjectionToken('is-platform-browser');


export function isPlatformBrowserFactory(
  platformId: string,
): boolean {
  return isPlatformBrowser(platformId);
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const IsPlatformBrowserProvider: Provider = {
  provide: APP_IS_PLATFORM_BROWSER,
  useFactory: isPlatformBrowserFactory,
  deps: [
    PLATFORM_ID,
  ],
};


export const APP_IS_PLATFORM_SERVER = new InjectionToken('is-platform-server');

export function isPlatformServerFactory(
  platformId: string,
): boolean {
  return isPlatformServer(platformId);
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const IsPlatformServerProvider: Provider = {
  provide: APP_IS_PLATFORM_SERVER,
  useFactory: isPlatformServerFactory,
  deps: [
    PLATFORM_ID,
  ],
};
