import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { GasNotationPipeModule } from '@cikrf/gas-utils/pipes';

import { UiKitModule } from '@ui/ui-kit.module';

import { BallotPageRoutingModule } from './ballot-page-routing.module';
import { BallotComponent } from './components/ballot/ballot.component';
import { QuestionComponent } from './components/question/question.component';
import { ConfirmComponent } from './components/confirm/confirm.component';
import { AnswerCardComponent } from './components/answer/answer-card/answer-card.component';
import { AnswerHeaderComponent } from './components/answer/answer-header/answer-header.component';
import { CutTextAnswerCardDirective } from './components/answer/cut-text-answer-card.directive';
import { ConfirmSingleQuestionComponent } from './components/confirm/confirm-single-question/confirm-single-question.component';
import { ConfirmCompletedComponent } from './components/confirm/confirm-completed/confirm-completed.component';
import { ConfirmMultiQuestionsComponent } from './components/confirm/confirm-multi-questions/confirm-multi-questions.component';
import { ConfirmListComponent } from './components/confirm/confirm-list/confirm-list.component';
import { ConfirmControlsComponent } from './components/confirm/confirm-controls/confirm-controls.component';
import { ScrollInstructionComponent } from './components/question/scroll-instruction/scroll-instruction.component';
import { VotingBoxComponent } from './components/question/voting-box/voting-box.component';
import { errorInterceptorProvider } from '@shared/interceptor/error.interceptor.provider';
import { TransferBetweenAppsModule } from '@modules/transfer-between-apps/transfer-between-apps.module';
import { CompletedQuestionComponent } from './components/question/completed-question/completed-question.component';
import { FinalPageComponent } from './components/final-page/final-page.component';
import { EmptyBallotComponent } from './components/final-page/empty-ballot/empty-ballot.component';
import { StepsComponent } from './components/steps/steps.component';
import { BallotsLeftComponent } from './components/ballots-left/ballots-left.component';
import { AnswersListComponent } from './components/question/answers-list/answers-list.component';
import { ClosedPageComponent } from './components/closed-page/closed-page.component';
import { FinalCompletedComponent } from './components/final-page/final-completed/final-completed.component';
import { LanguageComponent } from './components/language/language.component';

@NgModule({
  declarations: [
    BallotComponent,
    QuestionComponent,
    ConfirmComponent,
    AnswerCardComponent,
    AnswerHeaderComponent,
    CutTextAnswerCardDirective,
    ConfirmCompletedComponent,
    ConfirmSingleQuestionComponent,
    ConfirmMultiQuestionsComponent,
    ConfirmListComponent,
    ConfirmControlsComponent,
    ScrollInstructionComponent,
    VotingBoxComponent,
    CompletedQuestionComponent,
    FinalPageComponent,
    ClosedPageComponent,
    EmptyBallotComponent,
    StepsComponent,
    BallotsLeftComponent,
    AnswersListComponent,
    FinalCompletedComponent,
    LanguageComponent,
  ],
  imports: [
    CommonModule,
    BallotPageRoutingModule,
    UiKitModule,
    FormsModule,
    ReactiveFormsModule,
    GasNotationPipeModule,
    TransferBetweenAppsModule.forApp(
      window.ENV.PORTAL_URL,
      window.ENV.PRODUCTION,
    ),
  ],
  providers: [
    errorInterceptorProvider,
  ],
})
export class BallotPageModule {}
