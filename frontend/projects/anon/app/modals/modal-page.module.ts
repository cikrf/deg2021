import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModalRoutingModule } from './modal-routing.module';
import { SelectAvailableModalComponent } from './select-available-modal/select-available-modal.component';
import { ActivateModalComponent } from './activate-modal/activate-modal.component';
import { UiKitModule } from '@ui/ui-kit.module';
import { MaxCheckedModalComponent } from './max-checked-modal/max-checked-modal.component';

const COMPONENTS = [
  SelectAvailableModalComponent,
  ActivateModalComponent,
  MaxCheckedModalComponent,
];

@NgModule({
  declarations: [
    COMPONENTS,
  ],
  exports: [
    COMPONENTS,
  ],
  imports: [
    CommonModule,
    UiKitModule,
    ModalRoutingModule,
  ],
})
export class ModalPageModule {}
