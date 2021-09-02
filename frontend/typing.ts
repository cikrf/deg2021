/* eslint-disable @typescript-eslint/naming-convention */
export {};

declare global {
  interface Window {
    ENV: {
      ANON_URL: string;
      PORTAL_URL: string;
      SHOW_CLEANUP: string;
      PRODUCTION: boolean;
      TAG: string;
    };
  }
}
