import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { QuestionComponent } from './components/question/question.component';
import { ConfirmComponent } from './components/confirm/confirm.component';
import { QuestionGuard } from '../../guards/question.guard';
import { BallotComponent } from './components/ballot/ballot.component';
import { ClosedPageComponent } from './components/closed-page/closed-page.component';
import { FinalCompletedComponent } from './components/final-page/final-completed/final-completed.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'prefix',
        component: BallotComponent,
        children: [
          {
            path: 'confirm',
            pathMatch: 'full',
            component: ConfirmComponent,
          },
          {
            path: 'complete',
            pathMatch: 'full',
            component: FinalCompletedComponent,
          },
          {
            path: 'error',
            pathMatch: 'full',
            component: ClosedPageComponent,
          },
          {
            path: ':question',
            pathMatch: 'full',
            component: QuestionComponent,
            canActivate: [
              QuestionGuard,
            ],
          },
        ],
      },
    ]),
  ],
  exports: [
    RouterModule,
  ],
})
export class BallotPageRoutingModule { }
