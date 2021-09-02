/** Default mobile start */
export function isMobileOnly(): boolean {
  return isHasElementInView(document.getElementById('mobile-only'));
}

export function isMobileAndAbove(): boolean {
  return isHasElementInView(document.getElementById('mobile-and-above'));
}

export function isMobileAndBelow(): boolean {
  return isHasElementInView(document.getElementById('mobile-and-below'));
}
/** Default mobile end */



/** Sm mobile start */
export function isSmMobileOnly(): boolean {
  return isHasElementInView(document.getElementById('mobile-sm-only'));
}

export function isSmMobileAndAbove(): boolean {
  return isHasElementInView(document.getElementById('mobile-sm-and-above'));
}

export function isSmMobileAndBelow(): boolean {
  return isHasElementInView(document.getElementById('mobile-sm-and-below'));
}
/** Sm mobile end */



/** Tablet start */
export function isTabletOnly(): boolean {
  return isHasElementInView(document.getElementById('tablet-only'));
}

export function isTabletAndAbove(): boolean {
  return isHasElementInView(document.getElementById('tablet-and-above'));
}

export function isTabletAndBelow(): boolean {
  return isHasElementInView(document.getElementById('tablet-and-below'));
}
/** Tablet end */



/** Desktop start */
export function isDesktopOnly(): boolean {
  return isHasElementInView(document.getElementById('desktop-only'));
}

export function isDesktopAndAbove(): boolean {
  return isHasElementInView(document.getElementById('desktop-and-above'));
}

export function isDesktopAndBelow(): boolean {
  return isHasElementInView(document.getElementById('desktop-and-below'));
}
/** Desktop end */



/** Desktop wide start */
export function isDesktopWideOnly(): boolean {
  return isHasElementInView(document.getElementById('desktop-wide-only'));
}

export function isDesktopWideAndAbove(): boolean {
  return isHasElementInView(document.getElementById('desktop-wide-and-above'));
}

export function isDesktopWideAndBelow(): boolean {
  return isHasElementInView(document.getElementById('desktop-wide-and-below'));
}
/** Desktop wide end */

function isHasElementInView(element: HTMLElement | null): boolean {
  if (!element) {
    return false;
  }

  const display = window.getComputedStyle(element, null).getPropertyValue('display');

  return display === 'block';
}
