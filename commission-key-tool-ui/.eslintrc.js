module.exports = {
  parserOptions: {
    project: './tsconfig.json',
    sourceType: 'module',
    babelOptions: {
      configFile: './babel.config.js',
    },
  },
  settings: {
    'import/resolver': {
      // See https://github.com/benmosher/eslint-plugin-import/issues/1396#issuecomment-575727774 for line below
      node: {},
      webpack: {
        config: require.resolve('./.erb/configs/webpack.config.eslint.js'),
      },
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
  extends: [
    '@wavesenterprise/eslint-config/typescript-mixed',
    '@wavesenterprise/eslint-config/react',
  ],
  rules: {
    'no-redeclare': 'off',
  },
  globals: {
    ROOT_URL: 'readonly',
    heap: 'readonly',
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
}

