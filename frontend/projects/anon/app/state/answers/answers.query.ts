import { QueryEntity } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AnswersState, AnswersStore } from '@state/answers/answers.store';
import { Vote, VoteVariant } from '@models/vote.interface';
import { Answer } from '@models/elections';
import { sha256 } from 'js-sha256';

@Injectable({
  providedIn: 'root',
})
export class AnswersQuery extends QueryEntity<AnswersState> {

  constructor(protected store: AnswersStore) {
    super(store);
  }

  public isActive(id: Answer['id']): Observable<boolean> {
    return this.selectActive().pipe(
      map(() => this.hasActive(id)),
    );
  }

  public getVote(): Vote {
    return this.getAll().map((answer: Answer) => Number(this.hasActive(answer.id)) as VoteVariant);
  }

  public getHash(): string {
    const hash = this.getAll()
      .sort((a: Answer, b: Answer) => a.num - b.num)
      .map((answer: Answer) => answer.image)
      .filter((image: string) => !!image)
      .join(',');

    return !!hash ? sha256(hash) : hash;
  }
}
