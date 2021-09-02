module.exports = {
  "extends": [
    "../../.eslintrc.json"
  ],
  "overrides": [
    {
      "files": [
        "*.ts"
      ],
      "parserOptions": {
        "project": [
          ".././../tsconfig.json",
          "../../test/e2e/tsconfig.e2e.json"
        ],
        "createDefaultProgram": true,
        tsconfigRootDir: __dirname,
      },
      "extends": [
        "plugin:@angular-eslint/ng-cli-compat",
        "plugin:@angular-eslint/ng-cli-compat--formatting-add-on",
        "plugin:@angular-eslint/template/process-inline-templates",
        "@cikrf/eslint-config"
      ],
      "rules": {
        "@angular-eslint/component-selector": [
          "error",
          {
            "type": "element",
            "prefix": "ui",
            "style": "kebab-case"
          }
        ],
        "@angular-eslint/directive-selector": [
          "error",
          {
            "type": "attribute",
            "prefix": "ui",
            "style": "camelCase"
          }
        ]
      }
    }
  ]
}
