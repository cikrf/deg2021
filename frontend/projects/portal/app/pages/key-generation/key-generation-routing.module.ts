import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { KeyGenerationComponent } from './key-generation/key-generation.component';
import { BeforeKeyGenerationComponent } from './before-key-generation/before-key-generation.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: BeforeKeyGenerationComponent,
      },
      {
        path: 'process',
        pathMatch: 'full',
        component: KeyGenerationComponent,
        data: {
          title: 'Персональный код шифрования',
        },
      },
    ]),
  ],
  exports: [
    RouterModule,
  ],
})
export class KeyGenerationRoutingModule {}
