import { generateDefaultProps } from "../generate-default-props/generate-default-props";

export type TemplateType = (props: {
  content: string;
  componentName: string;
  path: string;
  props: string[];
  mockedImports: string;
  firstImportName: string;
}) => string;

export const componentTemplate: TemplateType = ({
  content,
  componentName,
  path,
  props,
  mockedImports,
  firstImportName,
}) => {
  const defaultProps = props.length
    ? generateDefaultProps({ componentName, props, content })
    : "";

  const describeArg1Spacing = " ".repeat(firstImportName.length - 3);
  const describeArg2Spacing = " ".repeat(firstImportName.length - 5);

  return `import React from 'react';
import { render } from '@testing-library/react';
import type { RenderResult } from '@testing-library/react';

import type { ${componentName}Type } from './${path}';
${mockedImports}

${defaultProps}describe('${componentName}', () => {
  let renderComponent: (props?: Partial<${componentName}Type>) => RenderResult;

  beforeEach(async () => {
    const { ${componentName} } = await import('./${path}');
    renderComponent = (${props.length ? "props" : ""}) =>
      render(<${componentName} ${
    props.length ? "{...DEFAULT_PROPS} {...props}" : ""
  } />);
  });

  afterEach(jest.clearAllMocks);

  describe.each\`
    component${describeArg1Spacing}| mockComponent${describeArg2Spacing}| expectedProps
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
};
