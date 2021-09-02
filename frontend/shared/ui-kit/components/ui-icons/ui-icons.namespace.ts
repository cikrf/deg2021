export namespace UiIcon {
  export enum Base {
    KeyboardArrowTop = 'keyboard-arrow-top',
    KeyboardArrowDown = 'keyboard-arrow-down',
    KeyboardArrowLeft = 'keyboard-arrow-left',
    KeyboardArrowRight = 'keyboard-arrow-right',
    ClassicArrowTop = 'classic-arrow-top',
    ClassicArrowLeft = 'classic-arrow-left',
    ClassicArrowRight = 'classic-arrow-right',
    BaseAdd = 'base-add',
    BaseClose = 'base-close',
    BaseRemove = 'base-remove',
    BaseBurgerMenu = 'base-burger-menu',
    BaseSuccess = 'base-success',
    BaseBall = 'base-ball',
    BaseClock = 'base-clock',
    BaseWatch = 'base-watch',
    BaseOk = 'base-ok',
    SquareOk = 'square-ok',
    ErrorBlock = 'error-block',
  }

  export enum Notice {
    Warning = 'notice-warning',
    Accept = 'notice-accept',
    Error = 'notice-error',
  }

  export enum Stuff {
    Check = 'stuff-check',
    Cross = 'stuff-cross',
    Warning = 'stuff-warning',
  }

  export type Icons = UiIcon.Base | UiIcon.Notice | UiIcon.Stuff;
}
