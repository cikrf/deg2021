import { HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpStatus } from '@cikrf/gas-utils/enums';

/** Helper для обработки mock и отправки requests */
export namespace MockHelper {

  /**
   * Generic функция для обработки перехваченных запросов
   *
   * @param request оригинальный запрос
   * @param next обработчик запросов из HttpClient
   * @param mockUrl url файла с mock
   * @param responseHandler кастомная функция для изменения полученного ответа
   * @param customData кастомные данные для добавления в ответ
   */
  export function handleRequest(
    request: HttpRequest<unknown>,
    next: HttpHandler,
    mockUrl: string,
    responseHandler: (
      req: HttpRequest<unknown>,
      resCopy: HttpResponse<unknown>,
      customData: unknown,
    ) => HttpResponse<unknown> = (req, res) => res,
    customData?: unknown,
  ): Observable<HttpEvent<unknown>> {
    const modifiedRequest: HttpRequest<unknown> = request.clone({
      url: mockUrl,
      method: 'GET',
    });

    return handleResponse(modifiedRequest, next, (res: HttpResponse<unknown>) =>
      responseHandler(request, res.clone(), customData),
    );
  }

  /**
   * Функция для обработки перехваченных запросов с выдачей ошибки
   *
   * @param request оригинальный запрос
   * @param status статус ошибки запроса
   * @param errorText текст ошибки
   */
  export function sendError(
    request: HttpRequest<unknown>,
    status: HttpStatus = HttpStatus.BAD_REQUEST,
    errorText: string = 'bad request',
  ): Observable<HttpEvent<unknown>> {
    return throwError(new HttpErrorResponse({
      error: errorText,
      headers: request.headers,
      status,
      url: request.url,
    }));
  }

  /**
   * Generic функция для обработки перехваченных ответов
   *
   * @param modifiedRequest перехваченный оригинальный запрос с измененным url на мок данные
   * @param next обработчик запросов из HttpClient
   * @param responseHandler кастомная функция для изменения полученного ответа
   */
  function handleResponse(
    modifiedRequest: HttpRequest<unknown>,
    next: HttpHandler,
    responseHandler: (res: HttpResponse<unknown>) => HttpResponse<unknown>,
  ): Observable<HttpEvent<unknown>> {
    return next.handle(modifiedRequest)
      .pipe(
        map((event: HttpEvent<unknown>) => {
          if (event instanceof HttpResponse) {
            return responseHandler(event);
          }

          return event;
        }),
      );
  }
}
