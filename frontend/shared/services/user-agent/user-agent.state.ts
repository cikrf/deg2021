/**
 * Определяемые ОС
 */
export enum UserAgentOS {
  Windows = 'Windows',
  Linux = 'Linux',
  MacOS = 'MacOS',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  iOS = 'iOS',
  Android = 'Android',
  WindowsPhone = 'WindowsPhone',
}

/**
 * Определяемые устройства
 */
export enum UserAgentDevice {
  Phone = 'Phone',
  Tablet = 'Tablet',
  Desktop = 'Desktop',
}

/**
 * Определяемые браузеры
 */
export enum UserAgentBrowser {
  Chrome = 'Google Chrome',
  Safari = 'Safari',
  Firefox = 'Firefox',
  Opera = 'Opera',
  Edge = 'Edge',
  ChromeEdge = 'ChromeEdge',
  IE = 'IE',
  YandexBrowser = 'YandexBrowser',
  CriOS = 'CriOS',
  Android = 'Android',
  MobileSafari = 'MobileSafari',
  Miui = 'MiuiBrowser',
  MobileSputnik = 'MobileSputnik',
}

export interface UserAgentBrowserVersion {
  browser: UserAgentBrowser;
  tillBrowserVersion?: string;
}

/**
 * Определенные состояния
 */
export interface UserAgentState {
  readonly userAgent: string;
  readonly os: UserAgentOSDetection;
  readonly osInfo: UserAgentOSInfoDetection;
  readonly device: UserAgentDeviceDetection;
  readonly browser: UserAgentBrowserDetection;
  readonly browserVersion: UserAgentBrowserVersionDetection;
}

/**
 * Определенное в User-Agent состояние
 */
abstract class UserAgentDetection<T> {
  /** Определенное состояние */
  public readonly value: T | null;

  constructor(value: T | null) {
    this.value = value;
  }

  /**
   * Сверяет состояние с ожидаемым
   */
  public is(value: T): boolean {
    return value === this.value;
  }

  /**
   * Сверяет состояние с множеством ожидаемых
   */
  public oneOf(values: Array<T | null>): boolean {
    return -1 !== values.indexOf(this.value);
  }
}

/**
 * Тип ОС, определенный в User-Agent
 */
export class UserAgentOSDetection extends UserAgentDetection<UserAgentOS> {
  public isIOS(): boolean {
    return this.value === UserAgentOS.iOS;
  }

  public isAndroid(): boolean {
    return this.value === UserAgentOS.Android;
  }

  public isWindows(): boolean {
    return this.value === UserAgentOS.Windows;
  }

  public isMacOs(): boolean {
    return this.value === UserAgentOS.MacOS;
  }
}

/**
 * Тип устройства, определенного из User-Agent
 */
export class UserAgentDeviceDetection extends UserAgentDetection<UserAgentDevice> {
  public isDesktop(): boolean {
    return this.value === UserAgentDevice.Desktop;
  }

  public isPhone(): boolean {
    return this.value === UserAgentDevice.Phone;
  }

  public isTablet(): boolean {
    return this.value === UserAgentDevice.Tablet;
  }

  public isMobile(): boolean {
    return this.value === UserAgentDevice.Phone || this.value === UserAgentDevice.Tablet;
  }
}

/**
 * Браузер, определенный в User-Agent
 */
export class UserAgentBrowserDetection extends UserAgentDetection<UserAgentBrowser> {
  public isChrome(): boolean {
    return this.value === UserAgentBrowser.Chrome;
  }

  public isFirefox(): boolean {
    return this.value === UserAgentBrowser.Firefox;
  }

  public isSafari(): boolean {
    return this.value === UserAgentBrowser.Safari;
  }

  public isEdge(): boolean {
    return this.value === UserAgentBrowser.Edge;
  }

  public isChromeEdge(): boolean {
    return this.value === UserAgentBrowser.ChromeEdge;
  }

  public isYandexBrowser(): boolean {
    return this.value === UserAgentBrowser.YandexBrowser;
  }

  public isMobileSafari(): boolean {
    return this.value === UserAgentBrowser.MobileSafari;
  }

  public isCriOS(): boolean {
    return this.value === UserAgentBrowser.CriOS;
  }

  public isSafariBased(): boolean {
    return (
      this.value === UserAgentBrowser.Safari
        || this.value === UserAgentBrowser.MobileSafari
    );
  }

  public isChromiumBased(): boolean {
    return (
      this.value === UserAgentBrowser.Chrome
        || this.value === UserAgentBrowser.Opera
        || this.value === UserAgentBrowser.YandexBrowser
    );
  }
}

/**
 * Версия браузера, определенная в User-Agent
 */
export class UserAgentBrowserVersionDetection extends UserAgentDetection<string> {
  /**
   * Проверяет, что текущая версия браузера старше чем переданная
   */
  public isLessThan(from: string, depth: number = 1): boolean {
    /**
     * TODO: Подумать, нужно ли сравнение по более детальной версии
     * Сейчас сравниваем только мажорные версии. Например:
     * Версия 87.0.4280.141
     * С глубиной 1 мы сравниваем первую цифру
     * И нужно ли с глубиной 2 сравнивать и вторую цифру
     */
    const intValue = depth === 1
      ? parseInt(this.value || '', 10)
      : parseInt(this.value || '', 10);
    const intFrom = depth === 1
      ? parseInt(from || '', 10)
      : parseInt(from || '', 10);

    return intValue <= intFrom;
  }

  /**
   * Проверяет, что текущая версия браузера мла чем переданная
   */
  public isMoreThan(from: string, depth: number = 1): boolean {
    /**
     * TODO: Подумать, нужно ли сравнение по более детальной версии
     * Сейчас сравниваем только мажорные версии. Например:
     * Версия 87.0.4280.141
     * С глубиной 1 мы сравниваем первую цифру
     * И нужно ли с глубиной 2 сравнивать и вторую цифру
     */
    const intValue = depth === 1
      ? parseInt(this.value || '', 10)
      : parseInt(this.value || '', 10);
    const intFrom = depth === 1
      ? parseInt(from || '', 10)
      : parseInt(from || '', 10);

    return intValue >= intFrom;
  }
}

/**
 * Версия браузера, определенная в User-Agent
 */
export class UserAgentOSInfoDetection extends UserAgentDetection<string> {
}
