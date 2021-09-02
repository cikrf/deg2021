import { enableProdMode } from '@angular/core';

if (process.env.PRODUCTION) {
  enableProdMode();
}

export { AppServerModule } from './app.server.module';
export { renderModule, renderModuleFactory } from '@angular/platform-server';
