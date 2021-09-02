import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { iif, Observable } from 'rxjs';
import { MockRequestName } from './mock-request-name.constant';
import { MockHelper } from './mock.helper';
import { delay } from 'rxjs/operators';
import sendError = MockHelper.sendError;
import { HttpStatus } from '@cikrf/gas-utils/enums';
import { REGISTRY_ENDPOINTS } from '../../../projects/portal/app/constants';

const ELECTIONS_MOCK_URL = './assets/mocks/elections.mock.json';
const PUBLIC_KEYS_MOCK_URL = './assets/mocks/public-keys.mock.json';

/**
 * Перехватчик HTTP запросов для подмены на mock ответы
 *
 * Включение: localStorage.setItem('activateMockService', 'elections')
 * Отключение: localStorage.removeItem('activateMockService');
 *
 * Значение это название endpoint
 */
@Injectable()
export class MockInterceptor implements HttpInterceptor {
  private activateMockFor: MockRequestName[] = [];

  private readonly activationLocalStorageKey = 'activateMockService';

  constructor() {
    this.activateMockFor = (localStorage.getItem(this.activationLocalStorageKey) || '')
      .split(',')
      .map((el: string) => el.trim())
      .filter(Boolean) as MockRequestName[];
  }

  public intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<any> {
    /** Если нет включения mock(передали пустоту или нет в localstorage), просто возвращаем */
    if (this.activateMockFor.length === 0) {
      return next.handle(req);
    }

    /** Обработка mock для elections(списка голосований) */
    if (this.activateMockFor.includes(MockRequestName.Elections)) {
      /**
       * Обработка списка голосований
       */
      if (this.isGetElections(req)) {
        return MockHelper.handleRequest(req, next, ELECTIONS_MOCK_URL);
      }
    }

    if (this.activateMockFor.includes(MockRequestName.PublicKeys)) {
      /**
       * Обработка ключей при переходе в анонимную зону
       */
      if (this.isGetPublicKeys(req)) {
        // Можно регулировать частоту появления экранов успешной генерации и ошибки путем изменения константы ниже
        return iif(
          () => Math.random() < 0.3,
          sendError(req, HttpStatus.BAD_REQUEST, 'Ошибка при генерации ключа'),
          MockHelper.handleRequest(req, next, PUBLIC_KEYS_MOCK_URL),
        ).pipe(delay(3000));
      }
    }

    return next.handle(req);
  }

  /**
   * Запрос получения списка голосований
   * GET /elections
   */
  private isGetElections(req: HttpRequest<unknown>): boolean {
    return req.method === 'GET' && req.url.indexOf(REGISTRY_ENDPOINTS.Elections) > -1;
  }

  /**
   * Запрос получения сгенерированных ключей
   * GET /public-keys
   */
  private isGetPublicKeys(req: HttpRequest<unknown>): boolean {
    return req.method === 'GET' && req.url.indexOf(REGISTRY_ENDPOINTS.PublicKeys) > -1;
  }
}
