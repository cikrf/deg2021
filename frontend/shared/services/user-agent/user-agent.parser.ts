import { isNullish } from '@helpers/general/general.helper';
import { UserAgentBrowser, UserAgentDevice, UserAgentOS } from './user-agent.state';

const OS_DETECTIONS: Array<[UserAgentOS, RegExp]> = [
  [UserAgentOS.iOS, /\b(iPhone|iPad|iPod)\b/],
  [UserAgentOS.Android, /\bAndroid\b/],
  [UserAgentOS.WindowsPhone, /\bWindows Phone\b/],
  [UserAgentOS.MacOS, /\bMacintosh\b/],
  [UserAgentOS.Windows, /\bWindows\b/],
  [UserAgentOS.Linux, /\bLinux\b/],
];

const DEVICE_DETECTIONS: Array<[UserAgentDevice, RegExp]> = [
  [UserAgentDevice.Phone, /^[^(]+(\(.*?\b(iPhone|iPod|Windows Phone)\b.*?\)|\(.*?\bAndroid\b.*?\).*?Mobile)/i],
  [UserAgentDevice.Tablet, /^[^(]+\(.*?\b(iPad|Android)\b.*?\)/i],
  [UserAgentDevice.Desktop, /^[^(]+\(.*\b(Windows|Macintosh|Linux)\b.*?\)/i],
];

const BROWSER_DETECTIONS: Array<[UserAgentBrowser, RegExp]> = [
  [UserAgentBrowser.Firefox, /Firefox\/([0-9\.]+)(?:\s|$)/],
  [UserAgentBrowser.Opera, /Opera\/([0-9\.]+)(?:\s|$)/],
  [UserAgentBrowser.Opera, /OPR\/([0-9\.]+)(:?\s|$)$/],
  [UserAgentBrowser.Edge, /Edge\/([0-9\._]+)/],
  [UserAgentBrowser.ChromeEdge, /Edg\/([0-9\._]+)/], // Chrome edge является другим браузером
  [UserAgentBrowser.IE, /Trident\/7\.0.*rv\:([0-9\.]+)\).*Gecko$/],
  [UserAgentBrowser.IE, /MSIE\s([0-9\.]+);.*Trident\/[4-7].0/],
  [UserAgentBrowser.IE, /MSIE\s(7\.0)/],
  [UserAgentBrowser.YandexBrowser, /YaBrowser\/([0-9\._]+)/],
  [UserAgentBrowser.Miui, /MiuiBrowser\/([0-9\.]+)-([a-z]+)/],
  [UserAgentBrowser.MobileSputnik, /Mobile(.*)SputnikBrowser\/([0-9\._]+)/],
  [UserAgentBrowser.Chrome, /(?!Chrom.*OPR)Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/],
  [UserAgentBrowser.CriOS, /CriOS\/([0-9\.]+)(:?\s|$)/],
  [UserAgentBrowser.Android, /Android\s([0-9\.]+)/],
  [UserAgentBrowser.MobileSafari, /Version\/([0-9\._]+).*Mobile.*Safari.*/],
  [UserAgentBrowser.Safari, /Version\/([0-9\._]+).*Safari/],
];

const SYSTEM_INFO_REGEXP = /^[^(]+\((.+?)\)/; // `<product>/<version> (<system-information>) ...`

export class UserAgentParser {
  public parseOS(userAgent: string): UserAgentOS | null {
    const systemInfo = this.parseSystemInfo(userAgent);

    return !isNullish(systemInfo)
      ? this.detectState(systemInfo || '', OS_DETECTIONS)
      : null;
  }

  public parseDevice(userAgent: string): UserAgentDevice | null {
    return this.detectState(userAgent, DEVICE_DETECTIONS);
  }

  public parseBrowser(userAgent: string): UserAgentBrowser | null {
    return this.detectState(userAgent, BROWSER_DETECTIONS);
  }

  public parseBrowserVersion(userAgent: string): string | null {
    return this.detectVersion(userAgent, BROWSER_DETECTIONS);
  }

  public parseOsInfo(userAgent: string): string {
    return this.parseSystemInfo(userAgent) || '';
  }

  private parseSystemInfo(userAgent: string): string | null {
    const systemInfoMatch = userAgent.match(SYSTEM_INFO_REGEXP);

    if (systemInfoMatch === null) {
      return null;
    }

    return systemInfoMatch[1];
  }

  private detectState<T>(source: string, detections: Array<[T, RegExp]>): T | null {
    let detected: T | null = null;

    for (const [state, regexp] of detections) {
      if (regexp.test(source)) {
        detected = state;

        break;
      }
    }

    return detected;
  }

  private detectVersion<T>(source: string, detections: Array<[T, RegExp]>): string | null {
    let detected: string | null = null;

    for (const [state, regexp] of detections) {
      if (regexp.test(source)) {
        const matchedSource = Boolean(source.match(regexp)) ? source.match(regexp) : null;

        detected = matchedSource ? matchedSource[1] : null;

        break;
      }
    }

    return detected;
  }
}

