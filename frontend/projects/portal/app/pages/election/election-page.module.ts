import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { tokenInterceptorProvider } from '../../providers/token.interceptor';
import { ElectionRoutingModule } from './election-routing.module';
import { UiKitModule } from '@ui/ui-kit.module';
import { ElectionsComponent } from './elections/elections.component';
import { ElectionComponent } from './election/election.component';
import { VotingComponent } from './voting/voting.component';
import { errorInterceptorProvider } from '@shared/interceptor/error.interceptor.provider';
import { KeyGenerationService } from '../key-generation/key-generation.service';
import { ElectionTimerComponent } from './election-timer/election-timer.component';

const COMPONENTS = [
  ElectionsComponent,
  ElectionComponent,
  VotingComponent,
  ElectionTimerComponent,
];

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ElectionRoutingModule,
    UiKitModule,
  ],
  declarations: [
    COMPONENTS,
  ],
  exports: [
    COMPONENTS,
  ],
  providers: [
    tokenInterceptorProvider, // todo проверить почему они тут? должно хватит в AppModule
    errorInterceptorProvider, // todo проверить почему они тут? должно хватит в AppModule
    KeyGenerationService,
  ],
})
export class ElectionPageModule { }
