
const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
  {
    ignores: ['node_modules/**', 'coverage/**'],
  },
  {
    files: ['src/**/*.js', 'tests/**/*.js'],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',

      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },

    rules: {
      ...js.configs.recommended.rules,

      // Permite variáveis não utilizadas temporariamente,
      // mas apresenta um aviso para que possamos corrigi-las.
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },
];
