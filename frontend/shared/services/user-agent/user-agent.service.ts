/** В пакет с утилитами переместить */

import { Inject, Injectable } from '@angular/core';

import { USER_AGENT_PROVIDER, UserAgentProvider } from './user-agent.provider';
import { UserAgentParser } from './user-agent.parser';
import {
  UserAgentState,
  UserAgentOSDetection,
  UserAgentOSInfoDetection,
  UserAgentDeviceDetection,
  UserAgentBrowserDetection,
  UserAgentBrowserVersionDetection,
} from './user-agent.state';
import { isNullish } from '@helpers/general/general.helper';

/**
 * Сервис для определения различных состояний в User-Agent.
 * Определяет тип ОС, тип устройства и браузер.
 *
 * <code>
 * User-Agent: <product> / <product-version> <comment>
 * Common format for web browsers:
 * User-Agent: Mozilla/<version> (<system-information>) <platform> (<platform-details>) <extensions>
 * </code>
 *
 * @example
 * service.state.device.isMobile();
 * service.device.isMobile();
 * service.browser.isSafariBased();
 * service.os.is(UserAgentOS.iOS);
 * service.os.oneOf([UserAgentOS.iOS, UserAgentOS.MacOS]);
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent
 */
@Injectable({
  providedIn: 'root',
})
export class UserAgentService {
  private parser = new UserAgentParser();
  private lastState: UserAgentState;

  /** Текущее состояние определений User-Agent */
  public get state(): UserAgentState {
    return this.getCurrentState();
  }

  /** Текущий User-Agent */
  public get userAgent(): string {
    return this.userAgentProvider.get();
  }

  /** Текущая ОС */
  public get os(): UserAgentOSDetection {
    return this.getCurrentState().os;
  }

  /** Текущая ОС */
  public get osInfo(): UserAgentOSInfoDetection {
    return this.getCurrentState().osInfo;
  }

  /** Текущее устройство */
  public get device(): UserAgentDeviceDetection {
    return this.getCurrentState().device;
  }

  /** Текущий браузер */
  public get browser(): UserAgentBrowserDetection {
    return this.getCurrentState().browser;
  }

  /** Версия браузере */
  public get browserVersion(): UserAgentBrowserVersionDetection {
    return this.getCurrentState().browserVersion;
  }

  public get browserAndOs(): string {
    return [
      [ this.browser.value, this.browserVersion.value ].join(' '),
      this.osInfo.value,
    ].join('; ');
  }

  constructor(
      @Inject(USER_AGENT_PROVIDER) private userAgentProvider: UserAgentProvider,
  ) {}

  private getCurrentState(): UserAgentState {
    const userAgent: string = this.userAgentProvider.get();

    if (isNullish(this.lastState) || this.lastState.userAgent !== userAgent) {
      this.lastState = this.parse(userAgent);
    }

    return this.lastState;
  }

  private parse(userAgent: string): UserAgentState {
    return {
      userAgent,
      os: new UserAgentOSDetection(this.parser.parseOS(userAgent)),
      osInfo: new UserAgentOSInfoDetection(this.parser.parseOsInfo(userAgent)),
      device: new UserAgentDeviceDetection(this.parser.parseDevice(userAgent)),
      browser: new UserAgentBrowserDetection(this.parser.parseBrowser(userAgent)),
      browserVersion: new UserAgentBrowserVersionDetection(this.parser.parseBrowserVersion(userAgent)),
    };
  }
}
