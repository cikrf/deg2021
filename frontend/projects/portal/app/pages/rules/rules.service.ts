import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';

import { Rules } from '@models/rules.interface';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RulesService {
  constructor(
    private http: HttpClient,
  ) {}

  public getRules(): Observable<Rules> {
    return this.http.get<Rules>(`/landing/rules.json`, {
      headers: {
        skipAppendToken: '',
      },
    }).pipe(
      catchError((err) => {
        console.warn(err);
        return of(null);
      }),
      map((rules) => {
        if (!rules) {
          return {
            rules: [],
            checkBoxes: [''],
          };
        }
        return rules;
      }),
    );
  }
}
