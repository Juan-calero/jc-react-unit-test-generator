export type GenerateComponentHeaderImportsType = (props: {
  componentName: string;
  path: string;
}) => string;

export const generateComponentHeaderImports: GenerateComponentHeaderImportsType =
  ({ componentName, path }) => `import React from 'react';
import { render } from '@testing-library/react';
import type { RenderResult } from '@testing-library/react';

import type { ${componentName}Type } from './${path}';`;
