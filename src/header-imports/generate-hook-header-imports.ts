export type GenerateHookHeaderImportsType = (props: {
  componentName: string;
  path: string;
}) => string;

export const generateHookHeaderImports: GenerateHookHeaderImportsType = ({
  componentName,
  path,
}) => `import { renderHook, RenderHookResult } from '@testing-library/react-hooks';

import type { ${componentName}Type } from './${path}';`;
