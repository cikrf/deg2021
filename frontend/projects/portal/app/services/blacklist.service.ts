import { Injectable } from '@angular/core';
import { UserAgentService } from '@services/user-agent/user-agent.service';
import {
  UserAgentBrowser,
  UserAgentBrowserVersion,
  UserAgentDevice,
  UserAgentOS,
} from '@services/user-agent/user-agent.state';

export interface BlacklistMeta {
  os: UserAgentOS[];
  device: UserAgentDevice[];
  browserVersion: UserAgentBrowserVersion[];
}

const BLACKLIST: BlacklistMeta[] = [
  {
    os: [
      UserAgentOS.Windows,
    ],
    device: [
      UserAgentDevice.Desktop,
    ],
    browserVersion: [
      {
        browser: UserAgentBrowser.IE,
      },
      {
        browser: UserAgentBrowser.Edge,
      },
    ],
  },
  {
    os: [
      UserAgentOS.Windows,
      UserAgentOS.MacOS,
    ],
    device: [
      UserAgentDevice.Desktop,
    ],
    browserVersion: [
      {
        browser: UserAgentBrowser.Firefox,
        tillBrowserVersion: '65',
      },
    ],
  },
  {
    os: [
      UserAgentOS.Android,
      UserAgentOS.Linux,
    ],
    device: [
      UserAgentDevice.Phone,
      UserAgentDevice.Tablet,
    ],
    browserVersion: [
      {
        browser: UserAgentBrowser.Miui,
      },
      {
        browser: UserAgentBrowser.MobileSputnik,
      },
      {
        browser: UserAgentBrowser.Chrome,
        tillBrowserVersion: '60',
      },
    ],
  },
];

/**
 * Сервис для управление черными списками useragent
 */
@Injectable({
  providedIn: 'root',
})
export class BlacklistService {
  public blacklist: BlacklistMeta[] = BLACKLIST;

  constructor(
    private userAgentService: UserAgentService,
  ) {}

  /** Проверка на случай, если текущий useragent пользователя попал в blacklist */
  public isCurrentInBlacklist(blacklist: BlacklistMeta[] = this.blacklist): boolean {
    return blacklist.find((meta: BlacklistMeta) => {
      const oneOfOs = this.userAgentService.os.oneOf(meta.os);
      const oneOfDevice = this.userAgentService.device.oneOf(meta.device);
      const oneOfBrowser = this.userAgentService.browser.oneOf(
        meta.browserVersion.map((browser: UserAgentBrowserVersion) => browser.browser),
      );
      let equalsAll = oneOfOs && oneOfDevice && oneOfBrowser;

      meta.browserVersion.forEach((browser: UserAgentBrowserVersion) => {
        if (browser.tillBrowserVersion) {
          equalsAll = equalsAll && this.userAgentService.browserVersion.isLessThan(browser.tillBrowserVersion);
        }
      });

      return equalsAll;
    }) !== undefined;
  }
}
