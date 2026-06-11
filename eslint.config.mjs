// Flat config (ESLint 9+) — compatível com @rocketseat/eslint-config v3.
// O pacote npm "eslint-plugin-object-calisthenics" não existe; regras equivalentes abaixo.

import rocketseatNode from '@rocketseat/eslint-config/node.mjs'

/** @type {import('eslint').Linter.Config[]} */
const maxParamsMessage =
  'Máximo de 2 parâmetros; prefira um objeto de opções (constructors são isentos).'

const maxParamsSelectors = [
  {
    selector: 'FunctionDeclaration[params.length>2]',
    message: maxParamsMessage,
  },
  {
    selector:
      'FunctionExpression[params.length>2]:not(MethodDefinition[kind="constructor"] > FunctionExpression)',
    message: maxParamsMessage,
  },
  {
    selector: 'ArrowFunctionExpression[params.length>2]',
    message: maxParamsMessage,
  },
]

const objectCalisthenicsRules = {
  // object-calisthenics/max-depth
  'max-depth': ['error', 2],
  // object-calisthenics/max-params (funções/métodos; constructors isentos via selectors)
  'max-params': 'off',
  '@typescript-eslint/max-params': 'off',
  // object-calisthenics/no-var
  'no-var': 'error',
  // object-calisthenics/no-else
  'no-else-return': 'warn',
  // object-calisthenics/max-nested-callbacks
  'max-nested-callbacks': ['error', 2],
  // object-calisthenics/no-magic-numbers
  'no-magic-numbers': [
    'warn',
    { ignore: [0, 1, -1], ignoreArrayIndexes: true, enforceConst: true },
  ],
  // object-calisthenics/one-var-declaration-per-line
  'one-var': ['error', 'never'],
  // object-calisthenics/no-loops (prefer map/filter/forEach)
  'no-restricted-syntax': [
    'warn',
    {
      selector: 'ForStatement',
      message: 'Evite loops imperativos; prefere map/filter/forEach/reduce.',
    },
    {
      selector: 'ForInStatement',
      message: 'Evite for-in; prefere métodos de array ou Object.entries.',
    },
    {
      selector: 'ForOfStatement',
      message: 'Evite for-of; prefere métodos funcionais quando possível.',
    },
    {
      selector: 'WhileStatement',
      message: 'Evite while; prefere abordagem funcional ou early return.',
    },
    {
      selector: 'DoWhileStatement',
      message: 'Evite do-while; prefere abordagem funcional ou early return.',
    },
  ],
  // extras recomendados para qualidade / código gerado por IA
  'max-lines-per-function': ['warn', { max: 40, skipBlankLines: true, skipComments: true }],
  'max-lines': ['warn', { max: 250, skipBlankLines: true, skipComments: true }],
  '@typescript-eslint/explicit-function-return-type': 'warn',
  '@typescript-eslint/no-explicit-any': 'warn',
  'id-length': [
    'warn',
    {
      min: 2,
      exceptions: ['_', 'i', 'j', 'k', 'x', 'y', 'z', 'id'],
    },
  ],
  complexity: ['warn', 8],
}

export default [
  {
    ignores: [
      'build/**',
      'coverage/**',
      'node_modules/**',
      'deploy/**',
      '**/*.d.ts',
      'eslint.config.mjs',
    ],
  },
  ...rocketseatNode,
  {
    rules: {
      ...objectCalisthenicsRules,
      'no-useless-constructor': 'off',
    },
  },
  {
    rules: {
      'no-restricted-syntax': ['error', ...maxParamsSelectors],
    },
  },
  {
    files: ['**/*.spec.ts', '**/*.int.spec.ts'],
    rules: {
      'no-undef': 'off',
    },
  },
]
