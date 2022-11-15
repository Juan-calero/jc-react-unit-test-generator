import { componentTemplate } from "../../src/templates/component-template";

const DEFAULT_PROPS = {
  componentName: "MyComponentName",
  path: "my-component-path",
  props: ["mockCOmponentProps"],
  mockedImports: "mockImports",
  firstImportName: "mockedToComponent",
};

describe("componentTemplate", () => {
  it("renders correctly with default props", () => {
    expect(componentTemplate(DEFAULT_PROPS))
      .toStrictEqual(`import React from 'react';
import { render } from '@testing-library/react';
import type { RenderResult } from '@testing-library/react';

import type { MyComponentNameType } from './my-component-path';
mockImports

const DEFAULT_PROPS: MyComponentNameType = {
  mockCOmponentProps: undefined,
};

describe('MyComponentName', () => {
  let renderComponent: (props?: Partial<MyComponentNameType>) => RenderResult;

  beforeEach(async () => {
    const { MyComponentName } = await import('./my-component-path');
    renderComponent = (props) =>
      render(<MyComponentName {...DEFAULT_PROPS} {...props} />);
  });

  afterEach(jest.clearAllMocks);

  describe.each\`
    component              | mockComponent            | expectedProps
    \${'mockedToComponent'} | \${mockmockedToComponent} | \${{}}
  \`('$component', ({ mockComponent, expectedProps }) => {
    it('renders with correct params', () => {
      renderComponent();
      expect(mockComponent).toBeCalledTimes(1);
      expect(mockComponent).toBeCalledWith(expectedProps, {});
    });
  });
});
`);
  });
});
