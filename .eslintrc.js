module.exports = {
  root: true,
  globals: {
     "$": true,
     "$$": true,
     "assert": true,
     "browser": true,
  },
  env: {
    browser: true,
    node: true
  },
  ignorePatterns: ["nuxt/", "coverage/"],
  plugins: ["prettier"],
  extends: [
    "@nuxtjs",
    "plugin:nuxt/recommended",
    "prettier",
    "plugin:prettier/recommended"
  ],
  rules: {
    'no-console': 'error',
    "vue/html-self-closing": "off"
  },
  overrides: [
    // typescript
    {
      files: ['*.ts', '*.tsx', '*.vue'],
      excludedFiles: ['*.js'],
      plugins: ["prettier","@typescript-eslint"],
      extends: [
        "@nuxtjs",
        "plugin:@typescript-eslint/recommended",
        "plugin:nuxt/recommended",
        "@nuxtjs/eslint-config-typescript",
        "prettier",
        "prettier/@typescript-eslint",
        "plugin:prettier/recommended"
      ],
      rules: {
        'no-console': 'error',
        "vue/html-self-closing": "off",
        'vue/multi-word-component-names': 0,
      }
    }
  ]
};
