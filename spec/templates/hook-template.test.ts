import { hookTemplate } from "../../src/templates/hook-template";

const DEFAULT_PROPS = {
  componentName: "MyComponentName",
  path: "my-component-path",
  props: ["mockProps"],
  mockedImports: "mockImports",
  firstImportName: "mockedToComponent",
};

describe("hookTemplate", () => {
  it("renders correctly with default props", () => {
    expect(hookTemplate(DEFAULT_PROPS))
      .toStrictEqual(`import { renderHook, RenderHookResult } from '@testing-library/react-hooks';

import type { MyComponentNameType } from './my-component-path';
mockImports

const DEFAULT_PROPS: Parameters<MyComponentNameType>[0] = {
  mockProps: undefined,
};

describe('MyComponentName', () => {
  let triggerHook: (
    props?: Partial<Parameters<MyComponentNameType>[0]>
  ) => RenderHookResult<
    Parameters<MyComponentNameType>[0],
    ReturnType<MyComponentNameType>
  >;

  beforeEach(async () => {
    const { myComponentName } = await import('./my-component-path');
    triggerHook = (props) =>
      renderHook(() => myComponentName({ ...DEFAULT_PROPS, ...props }));
  });

  afterEach(jest.clearAllMocks);

  it.each\`
    callback               | mockCallback             | expectedResult
    \${'mockedToComponent'} | \${mockmockedToComponent} | \${{}}
  \`('$callback', ({ mockCallback, expectedResult }) => {
    triggerHook();
    expect(mockCallback).toBeCalledTimes(1);
    expect(mockCallback).toBeCalledWith(expectedResult);
  });
});
`);
  });
});
