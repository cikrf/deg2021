import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SelectAvailableModalComponent } from './select-available-modal/select-available-modal.component';
import { ActivateModalComponent } from './activate-modal/activate-modal.component';
import { MaxCheckedModalComponent } from './max-checked-modal/max-checked-modal.component';
import { ModalRoutingEnum } from './modal-routing.enum';

const routes: Routes = [
  {
    path: ModalRoutingEnum.SelectionEnabled,
    component: SelectAvailableModalComponent,
    outlet: 'modal',
  },
  {
    path: ModalRoutingEnum.ScrollToBottom,
    component: ActivateModalComponent,
    outlet: 'modal',
  },
  {
    path: ModalRoutingEnum.MultiSelectEnough,
    component: MaxCheckedModalComponent,
    outlet: 'modal',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule],
})
export class ModalRoutingModule { }
