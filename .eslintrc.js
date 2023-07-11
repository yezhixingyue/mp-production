module.exports = {
  root: true,
  env: {
    node: true,
    'vue/setup-compiler-macros': true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/airbnb',
    '@vue/typescript/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'linebreak-style': ['off', 'windows'],
    'import/prefer-default-export': 'off',
    'no-underscore-dangle': 'off',
    'arrow-parens': 'off',
    'vuejs-accessibility/form-control-has-label': 'off',
    'vuejs-accessibility/mouse-events-have-key-events': 'off',
    'import/no-cycle': 'off',
    'no-plusplus': 'off',
    'no-shadow': 'off',
    'max-len': ['error', { code: 160 }],
    'vuejs-accessibility/click-events-have-key-events': 'off',
    'vuejs-accessibility/label-has-for': 'off',
    'vue/multi-word-component-names': 'off',
    'object-curly-newline': 'off',
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
      env: {
        jest: true,
      },
    },
  ],
};
