module.exports = {
  extends: 'erb',
  plugins: ['@typescript-eslint'],
  rules: {
    // A temporary hack related to IDE not resolving correct package.json
    'import/no-extraneous-dependencies': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-filename-extension': 'off',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'import/no-import-module-exports': 'off',
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    'no-unused-expressions': 'off',
    'import/prefer-default-export': 'off',
    'promise/always-return': 'off',
    'react/function-component-definition': 'off',
    'jsx-a11y/alt-text': 'off',
    'import/no-cycle': 'off',
    'react/require-default-props': 'off',
    'no-use-before-define': 'off',
    'react/jsx-curly-brace-presence': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-no-useless-fragment': 'off',
    'no-else-return': 'off',
    'consistent-return': 'off',
    'react/no-array-index-key': 'off',
    'import/order': 'off',
    'operator-assignment': 'off',
    'import/no-named-as-default': 'off',
    'prefer-exponentiation-operator': 'off',
    'no-restricted-properties': 'off',
    'one-var': 'warn',
    'prefer-promise-reject-errors': 'off',
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  settings: {
    'import/resolver': {
      // See https://github.com/benmosher/eslint-plugin-import/issues/1396#issuecomment-575727774 for line below
      node: {},
      webpack: {
        config: require.resolve('./.erb/configs/webpack.config.eslint.ts'),
      },
      typescript: {},
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
};
