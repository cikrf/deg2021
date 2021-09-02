import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UiKitModule } from '@ui/ui-kit.module';
import { RulesRoutingModule } from './rules-routing.module';
import { RulesComponent } from './rules.component';
import { DesktopRulesComponent } from './desktop/desktop-rules.component';
import { MobileRulesComponent } from './mobile/mobile-rules.component';
import { MobileRulesHeaderComponent } from './mobile/mobile-rules-header/mobile-rules-header.component';
import { RulesConfirmFormComponent } from './confirm-form/rules-confirm-form.component';
import { FullRulesComponent } from './full-rules/full-rules.component';
import { RulesStepOneComponent } from './steps/steps-one/rules-steps-one.component';
import { RulesStepTwoComponent } from './steps/steps-two/rules-steps-two.component';
import { RulesStepThreeComponent } from './steps/steps-three/rules-steps-three.component';

@NgModule({
  declarations: [
    RulesComponent,
    DesktopRulesComponent,
    MobileRulesComponent,
    MobileRulesHeaderComponent,
    RulesConfirmFormComponent,
    FullRulesComponent,
    RulesStepOneComponent,
    RulesStepTwoComponent,
    RulesStepThreeComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RulesRoutingModule,
    UiKitModule,
  ],
})
export class RulesModule {}
