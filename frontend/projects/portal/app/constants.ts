export const TOKEN_KEY = 'token';
export const ACCEPT_RULES_STORAGE_KEY = 'accept_rules';
export const NO_ELECTIONS_LIST = 'no_elections_list';
export const RETURN_URL_QUERY_KEY = 'returnUrl';
export const GLOBAL_API_PREFIX = '/api';

export const CHECKOUT_API_PREFIX = `${GLOBAL_API_PREFIX}/checkup`;

export const CHECKOUT_ENDPOINTS = Object.freeze({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  PublicKey: `${CHECKOUT_API_PREFIX}/public-key`,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  BlindSign: `${CHECKOUT_API_PREFIX}/blind-sign`,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Vote: `${CHECKOUT_API_PREFIX}/vote`,
});

export const REGISTRY_ENDPOINTS = Object.freeze({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  PublicKeys: `${GLOBAL_API_PREFIX}/blind-sign/public-keys`,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  BlindSign: `${GLOBAL_API_PREFIX}/blind-signs`,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  CleanUpBlindSign: `${GLOBAL_API_PREFIX}/ballot-registry/voting/`,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Passphrases: `${GLOBAL_API_PREFIX}/passphrases`,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  VerificationType: `${GLOBAL_API_PREFIX}/verification/type`,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Elections: `${GLOBAL_API_PREFIX}/elections`,
});

export const AUTH_ENDPOINTS = Object.freeze({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Verification: `${GLOBAL_API_PREFIX}/auth/verification`,
});

export const SUPPORT_ENDPOINTS = Object.freeze({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Message: `${GLOBAL_API_PREFIX}/support/message`,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Sms: `${GLOBAL_API_PREFIX}/support/sms`,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Code: `${GLOBAL_API_PREFIX}/support/sms/code`,
});

export const CHECKUP_SESSION_STORAGE_KEY = 'checkup_complete';
export const CHECKUP_LOCAL_STORAGE_KEY = 'checkup';
