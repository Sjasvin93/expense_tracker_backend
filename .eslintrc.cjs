module.exports = {
    root: true,
    parserOptions: {
      ecmaVersion: 2022,
    },
    env: {
      node: true,
      es2022: true,
    },
    plugins: ['promise', 'security', 'prettier'],
    extends: [
      'eslint:recommended',
      'plugin:promise/recommended',
      'plugin:prettier/recommended',
    ],
    rules: {
      // Security plugin rules added manually
      'security/detect-object-injection': 'warn',
      'security/detect-non-literal-fs-filename': 'warn',
      'security/detect-eval-with-expression': 'warn',
      'security/detect-buffer-noassert': 'warn',
      'security/detect-child-process': 'warn',
  
      // Your original rules
      camelcase: ['error', { properties: 'always' }],
      'no-console': 'warn',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      'comma-dangle': ['error', 'always-multiline'],
      'object-shorthand': ['error', 'always'],
      'prefer-const': ['error'],
      'arrow-body-style': ['error', 'as-needed'],
      'no-var': 'error',
      'no-multiple-empty-lines': ['error', { max: 1 }],
      'no-underscore-dangle': ['error', { allowAfterThis: true }],
      'array-callback-return': 'error',
      'default-case': 'error',
      'dot-notation': 'error',
      'max-len': ['error', { code: 150 }],
      'newline-before-return': 'error',
      'no-shadow': 'error',
      'no-param-reassign': ['error', { props: true }],
      'require-await': 'error',
      'linebreak-style': ['off'],
    },
  };
  