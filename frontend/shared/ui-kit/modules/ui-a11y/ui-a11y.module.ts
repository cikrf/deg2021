import { NgModule } from '@angular/core';
import { UiA11ySwitchButtonEyeComponent } from './components/ui-a11y-switch-button-eye/ui-a11y-switch-button-eye.component';
import { UiA11yComponent } from './ui-a11y.component';
import { UiA11yService } from './ui-a11y.service';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    UiA11ySwitchButtonEyeComponent,
    UiA11yComponent,
  ],
  exports: [
    UiA11ySwitchButtonEyeComponent,
    UiA11yComponent,
  ],
  providers: [
    UiA11yService,
  ],
})
export class UiA11yModule {

}
