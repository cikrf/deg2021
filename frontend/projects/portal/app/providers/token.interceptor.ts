import { Provider } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { UniversalTokenService } from '../services/universal-token.service';

export const tokenInterceptorProvider: Provider = {
  provide: HTTP_INTERCEPTORS,
  useExisting: UniversalTokenService,
  multi: true,
};
