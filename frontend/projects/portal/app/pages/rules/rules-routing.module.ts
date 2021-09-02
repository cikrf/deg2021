import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FullRulesComponent } from './full-rules/full-rules.component';
import { RulesComponent } from './rules.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: RulesComponent,
      },
      {
        path: 'full',
        pathMatch: 'full',
        component: FullRulesComponent,
      },
    ]),
  ],
  exports: [
    RouterModule,
  ],
})
export class RulesRoutingModule {}
