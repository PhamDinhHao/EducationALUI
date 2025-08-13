import js from '@eslint/js'
import globals from 'globals'
import tsParser from '@typescript-eslint/parser'
 
import tseslint from 'typescript-eslint'
import prettier from 'eslint-plugin-prettier'
 
export default tseslint.config(
  { ignores: ['dist', 'shipitfile.js'] },
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    settings: {
      commonjs: true,
      es6: true,
      node: true
    },
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: { globals: globals.node, ecmaVersion: 2020, parser: tsParser },
    plugins: {
      prettier
    },
    rules: {
      'prettier/prettier': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
      'comma-dangle': 'off',
      'no-trailing-spaces': 'off',
      'no-multiple-empty-lines': 'off',
      'eol-last': 'off',
      'end-of-line': 'auto'
    }
  }
)