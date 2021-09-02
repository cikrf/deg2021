import { NgModule } from '@angular/core';
import { PlaygroundComponent } from './playground.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UiKitModule } from '@ui/ui-kit.module';

@NgModule({
  declarations: [
    PlaygroundComponent,
  ],
  imports: [
    CommonModule,
    UiKitModule,
    RouterModule.forChild([
      {
        path: '',
        component: PlaygroundComponent,
      },
    ]),
  ],
})
export class PlaygroundPageModule {

}
