import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GasTimeIntervalPipeModule } from '@cikrf/gas-utils/pipes';

import { UiButtonComponent } from './components/ui-button/button/ui-button.component';
import { UiIconComponent } from './components/ui-icons/ui-icon.component';
import { UiCircleButtonComponent } from './components/ui-button/circle-button/circle-button.component';
import { UiSwitchComponent } from './components/ui-switch/ui-switch.component';
import { UiAvatarComponent } from './components/ui-avatar/ui-avatar.component';
import { UiCheckboxComponent } from './components/ui-checkbox/ui-checkbox.component';
import { UiFooterComponent } from './components/ui-footer/ui-footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UiLayoutComponent } from './components/ui-layout/ui-layout.component';
import { UiBaseModalComponent } from './components/modal/ui-base-modal.component';
import { UiTimerComponent } from './components/ui-timer/ui-timer.component';
import { UiLayoutHeaderComponent } from './components/ui-layout-header/ui-layout-header.component';
import { UiLayoutAnonHeaderComponent } from './components/ui-layout-anon-header/ui-layout-anon-header.component';
import { UiDividerComponent } from './components/ui-divider/ui-divider.component';
import { UiUnavailableComponent } from './components/ui-unavailable/ui-unavailable.component';
import { UiTextCutPipe } from './pipes/ui-text-cut.pipe';
import { BrowserServicesModule } from '../modules/browser-services/browser-services.module';
import { UiCardComponent } from './components/ui-card/ui-card.component';
import { UiCardHeaderComponent } from './components/ui-card/header/ui-card-header.component';
import { UiCardControlComponent } from './components/ui-card/control/ui-card-control.component';
import { UiCardContentComponent } from './components/ui-card/content/ui-card-content.component';
import { UiPreloaderDirective } from './directives/ui-preloader.directive';
import { UiPreloaderComponent } from './components/ui-preloader/ui-preloader.component';
import { UiVotingCardComponent } from './components/ui-vote-card/ui-voting-card.component';
import { UiMediaComponent } from './components/ui-media/ui-media.component';
import { UiImagePreloaderComponent } from './components/ui-image-preloader/ui-image-preloader.component';
import { UiError404PageComponent } from '@ui/components/ui-error-404-page/ui-error404-page.component';
import { UiError50xPageComponent } from '@ui/components/ui-error-50x-page/ui-error50x-page.component';
import { UiRepeatArrayPipe } from './pipes/ui-array';
import { UiAccordionComponent } from '@ui/components/ui-accordion/ui-accordion.component';
import { UiUnavailableBrowserComponent } from './components/ui-unavailable-browser/ui-unavailable-browser.component';
import { UiLayoutNewComponent } from './components/ui-layout-new/ui-layout-new.component';
import { UiVotingCardContentComponent } from './components/ui-voting-card/ui-voting-card.component';
import { UiLinkComponent } from './components/ui-link/ui-link.component';
import { UiUpButtonComponent } from './components/ui-up-button/ui-up-button.component';
import { UiTimeIntervalPipe } from '@ui/pipes/ui-time-interval.pipe';
import { UiA11yModule } from '@ui/modules/ui-a11y/ui-a11y.module';

const COMPONENTS = [
  UiIconComponent,
  UiButtonComponent,
  UiCircleButtonComponent,
  UiSwitchComponent,
  UiCheckboxComponent,
  UiAvatarComponent,
  UiTimerComponent,
  UiFooterComponent,
  UiLayoutComponent,
  UiBaseModalComponent,
  UiLayoutHeaderComponent,
  UiLayoutAnonHeaderComponent,
  UiDividerComponent,
  UiUnavailableComponent,
  UiCardComponent,
  UiCardHeaderComponent,
  UiCardControlComponent,
  UiCardContentComponent,
  UiPreloaderComponent,
  UiVotingCardComponent,
  UiMediaComponent,
  UiImagePreloaderComponent,
  UiError404PageComponent,
  UiError50xPageComponent,
  UiAccordionComponent,
  UiUnavailableBrowserComponent,
  UiLayoutNewComponent,
  UiVotingCardContentComponent,
  UiLinkComponent,
  UiUpButtonComponent,
];

const PIPES = [
  UiTextCutPipe,
  UiRepeatArrayPipe,
  UiTimeIntervalPipe,
];

const DIRECTIVES = [
  UiPreloaderDirective,
];

const MODULES = [
  UiA11yModule,
];

@NgModule({
  declarations: [
    COMPONENTS,
    PIPES,
    DIRECTIVES,
  ],
  exports: [
    COMPONENTS,
    PIPES,
    DIRECTIVES,
    MODULES,
  ],
  entryComponents: [
    UiPreloaderComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GasTimeIntervalPipeModule,
    BrowserServicesModule,
    RouterModule,
    MODULES,
  ],
})
export class UiKitModule {
}
