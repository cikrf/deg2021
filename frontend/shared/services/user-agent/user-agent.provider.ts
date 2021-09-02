import { PLATFORM_ID, inject, InjectionToken } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Получает значение User-Agent
 */
export interface UserAgentProvider {
  get(): string;
}

/**
 * Предопределенные поставщики User-Agent
 */
export namespace UserAgentProviders {
  /**
   * Создает поставщика постоянного значения
   */
  export function createStaticProvider(userAgent: string): UserAgentProvider {
    if (typeof userAgent !== 'string') {
      throw new TypeError(`Expected type of User-Agent is string. Got ${typeof userAgent}.`);
    }

    return {
      get(): string {
        return userAgent;
      },
    };
  }

  /**
   * Создает поставщика для браузера
   */
  export function createBrowserProvider(): UserAgentProvider {
    if (typeof navigator === 'undefined' || typeof navigator.userAgent === 'undefined') {
      return {
        get(): string {
          return '';
        },
      };
    }

    return {
      get(): string {
        return navigator.userAgent;
      },
    };
  }
}

/**
 * Токен для получения значение User-Agent
 */
export const USER_AGENT_PROVIDER = new InjectionToken<UserAgentProvider>('user-agent.provider', {
  providedIn: 'root',
  factory: function UserAgentProviderFactory(): UserAgentProvider {
    const platformId = inject(PLATFORM_ID);

    if (isPlatformBrowser(platformId)) {
      return UserAgentProviders.createBrowserProvider();
    } else {
      return UserAgentProviders.createStaticProvider('');
    }
  },
});
