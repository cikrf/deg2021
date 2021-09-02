import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ElectionsComponent } from './elections/elections.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: ElectionsComponent,
      },
    ]),
  ],
  exports: [
    RouterModule,
  ],
})
export class ElectionRoutingModule {}
