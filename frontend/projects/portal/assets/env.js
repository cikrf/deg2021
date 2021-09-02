(function (window) {

  function defaults(variable, defaults) {
    if (/^\$\{(.*)\}$/.test(variable)) {
      if (/^\$\{(.*)\}$/.test(defaults)) {
        return undefined;
      }
      return defaults;
    }

    switch (typeof defaults) {
      case 'boolean':
        if (variable === true.toString()) {
          return true;
        } else if (variable === false.toString()) {
          return false;
        } else {
          return !!variable;
        }
      case 'number':
        return Number(variable);
    }

    return variable;
  }

  window.ENV = window.ENV || {};

  window.ENV.ANON_URL = defaults('${ANON_URL}', 'http://' + window.location.hostname + ':4201');
  window.ENV.TAG = defaults('${TAG}', '');

  window.ENV.SHOW_CLEANUP = defaults('${SHOW_CLEANUP}', true);
  window.ENV.PRODUCTION = defaults('${PRODUCTION}', false);

}(this));
