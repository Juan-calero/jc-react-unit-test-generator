export type TemplateType = (props: {
  componentName: string;
  path: string;
  props: string[];
  mockedImports: string;
  firstImportName: string;
}) => string;

export const componentTemplate: TemplateType = ({
  componentName,
  path,
  props,
  mockedImports,
  firstImportName,
}) => `import React from 'react';
import { render } from '@testing-library/react';
import type { RenderResult } from '@testing-library/react';

import type { ${componentName}Type } from './${path}';
${mockedImports}

const DEFAULT_PROPS: ${componentName}Type = {${props
  .map((prop) =>
    prop.includes("}") ? `\n  ${prop},` : `\n  ${prop}: undefined,`
  )
  .join("")}
};

describe('${componentName}', () => {
  let renderComponent: (props?: Partial<${componentName}Type>) => RenderResult;

  beforeEach(async () => {
    const { ${componentName} } = await import('./${path}');
    renderComponent = (props) =>
      render(<${componentName} {...DEFAULT_PROPS} {...props} />);
  });

  afterEach(jest.clearAllMocks);

  describe.each\`
    component      | mockComponent    | expectedProps
    \${'${firstImportName}'} | \${mock${firstImportName}} | \${{}}
  \`('$component', ({ mockComponent, expectedProps }) => {
    it('renders with correct params', () => {
      renderComponent();
      expect(mockComponent).toBeCalledTimes(1);
      expect(mockComponent).toBeCalledWith(expectedProps, {});
    });
  });
});
`;
