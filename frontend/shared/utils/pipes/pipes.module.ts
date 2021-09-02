import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToStringPipe } from './to-string.pipe';

@NgModule({
  declarations: [
    ToStringPipe,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    ToStringPipe,
  ],
})
export class PipesModule { }
