const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');


module.exports = tseslint.config(
  { ignores: ['.angular/**', 'dist/**', 'node_modules/**'] },

  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...angular.configs.tsRecommended,
    ],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
    }
  },

  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended],
    rules: {}
  }
);