import { QueryEntity } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { QuestionsState, QuestionsStore } from './questions.store';
import { Question } from '@models/elections';

@Injectable({
  providedIn: 'root',
})
export class QuestionsQuery extends QueryEntity<QuestionsState> {

  constructor(protected store: QuestionsStore) {
    super(store);
  }

  public isActive(id: Question['id']): Observable<boolean> {
    return this.selectActive().pipe(
      map(() => this.hasActive(id)),
    );
  }

  public getUncompleted(): Question | undefined {
    return this.getAll().find(({completed}) => !completed);
  }
}
