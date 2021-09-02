import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

// todo move to errors?
export class ApiError<T = any> extends Error {
  constructor(
    public readonly code: number,
    public readonly description: string,
    public readonly serverMessage: string,
    public readonly response: HttpResponse<T> | HttpErrorResponse,
  ) {
    super(description);
  }
}
