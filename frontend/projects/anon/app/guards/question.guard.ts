import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { QuestionsQuery } from '@state/questions/questions.query';

@Injectable({
  providedIn: 'root',
})
export class QuestionGuard implements CanActivate {
  constructor(
    private questionsQuery: QuestionsQuery,
    private router: Router,
  ) {}

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const questionId: string = route.params['question'];
    if (!questionId || !this.questionsQuery.hasEntity(questionId) || questionId !== this.questionsQuery.getActiveId()) {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}
