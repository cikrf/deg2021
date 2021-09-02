import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthenticationComponent } from './authentication.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: AuthenticationComponent,
      },
    ]),
  ],
  exports: [
    RouterModule,
  ],
})
export class AuthenticationRoutingModule {}
