import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { UiKitModule } from '@ui/ui-kit.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'deg' }),
    AppRoutingModule,
    UiKitModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
