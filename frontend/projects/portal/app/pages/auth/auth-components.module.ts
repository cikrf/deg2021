import { AuthComponent } from './auth.component';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { UiKitModule } from '@ui/ui-kit.module';

@NgModule({
  imports: [
    TranslateModule,
    RouterModule,
    UiKitModule,
  ],
  declarations: [
    AuthComponent,
  ],
})
export class AuthComponentsModule {}
