// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: ['dist', 'node_modules', 'coverage'], 
  },
  ...tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.recommended,
  ),
];

// export default tseslint.config(
//   eslint.configs.recommended,
//   tseslint.configs.recommended,
// );