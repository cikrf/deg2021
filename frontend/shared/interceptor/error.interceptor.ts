import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpUserEvent,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, filter, map } from 'rxjs/operators';
import { ApiError } from './api.error';
import { NavigationError, Router } from '@angular/router';

export declare interface IApiError {
  code: number;
  description: string;
  serverMessage: string;
}

export declare interface IApiResponse<T> {
  data: T;
  error: IApiError;
}

export function createError<T = any>(error: IApiError, response: HttpResponse<T> | HttpErrorResponse): ApiError {
  const { code, description, serverMessage } = error;
  return new ApiError<T>(code, description, serverMessage, response);
}

const CHUNK_LOAD_ERROR = 'ChunkLoadError';

@Injectable({
  providedIn: 'root',
})
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
  ) {
    this.router.events.pipe(
      filter(e => e instanceof NavigationError),
    ).subscribe((error: NavigationError) => {
      const isChunkError = error.error.name === CHUNK_LOAD_ERROR;

      if (isChunkError) {
        this.gotoError(this.router.url, error);
      }
    });
  }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err) => {
        const response: HttpResponse<unknown> = err instanceof HttpErrorResponse ? err : err.response;

        if (response.status >= 500 || response.status === 0) {
          this.gotoError(this.router.url, response);
          return of({
            type: HttpEventType.User,
          } as HttpUserEvent<unknown>);
        }

        if (err instanceof HttpErrorResponse && err.error?.error) {
          throw createError(err.error.error, err);
        }
        return throwError(err);
      }),
      map((response: HttpResponse<IApiResponse<any>>) => {
        if (response.body?.error) {
          throw createError(response.body.error, response);
        }
        if (response.body?.data) {
          return response.clone({
            body: response.body.data,
          });
        }
        return response;
      }),
    );
  }

  public gotoError(returnUrl: string, context?: any): void {
    setTimeout(() => {
      this.router.navigate(['/', 'error', 'SERVER_ERROR'], {
        queryParams: { returnUrl },
        skipLocationChange: true,
        state: context,
      }).then();
    }, 0);
  }

}
