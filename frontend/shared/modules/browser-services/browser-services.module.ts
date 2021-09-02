import { NgModule } from '@angular/core';
import { WindowService } from './window.service';
import { IsPlatformBrowserProvider } from '../../providers/is-platform';

@NgModule({
  providers: [
    WindowService,
    IsPlatformBrowserProvider,
  ],
})
export class BrowserServicesModule {}
