import { Injectable } from '@angular/core';
import { EntityState, EntityStore, MultiActiveState, StoreConfig } from '@datorama/akita';
import { NgOnDestroy } from '@cikrf/gas-utils/decorators';
import { Answer, Question } from '@models/elections';
import { Observable } from 'rxjs';
import { filter, takeUntil, tap } from 'rxjs/operators';
import { QuestionsQuery } from '../questions/questions.query';

export interface AnswersState extends EntityState<Answer, Answer['id']>, MultiActiveState {
  question: Question;
}

@Injectable({
  providedIn: 'root',
})
@StoreConfig({
  name: 'answers',
  idKey: 'id',
  resettable: true,
})
export class AnswersStore extends EntityStore<AnswersState> {

  @NgOnDestroy()
  private destroy$!: Observable<void>;

  constructor(
    private questionsQuery: QuestionsQuery,
  ) {
    super();
    this.questionsQuery.selectActive()
      .pipe(
        takeUntil(this.destroy$),
        filter((question: Question) => !!question),
        tap((question: Question) => {
          this.setAnswers(question);
        }),
      )
      .subscribe();
  }

  public setAnswers(question: Question): void {
    const currentQuestion = this.getValue().question;
    if (!currentQuestion || currentQuestion.id !== question.id) {
      this.reset();
    }
    this.update({
      question,
    });
    this.set(question.answers);
  }
}
