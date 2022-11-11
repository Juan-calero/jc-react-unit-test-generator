import type { TemplateType } from "./component-template";

export const hookTemplate: TemplateType = ({
  componentName,
  path,
  mockedImports,
  firstImportName,
  props,
}) => {
  const hookName = componentName.replace(/^[A-Z]/, (x) => x.toLowerCase());

  return `import { renderHook, RenderHookResult } from '@testing-library/react-hooks';

import type { ${componentName}Type } from './${path}';
${mockedImports}

const DEFAULT_PROPS: Parameters<${componentName}Type>[0] = {${props
    .map((prop) =>
      prop.includes("}") ? `\n  ${prop},` : `\n  ${prop}: undefined,`
    )
    .join("")}
};

describe('${componentName}', () => {
  let triggerHook: (
    props?: Partial<Parameters<${componentName}Type>[0]>
  ) => RenderHookResult<
    Parameters<${componentName}Type>[0],
    ReturnType<${componentName}Type>
  >;

  beforeEach(async () => {
    const { ${hookName} } = await import('./${path}');
    triggerHook = (props) =>
      renderHook(() => ${hookName}({ ...DEFAULT_PROPS, ...props }));
  });

  afterEach(jest.clearAllMocks);

  it.each\`
    callback      | mockCallback    | expectedResult
    \${'${firstImportName}'} | \${mock${firstImportName}} | \${{}}
  \`('$callback', ({ mockCallback, expectedResult }) => {
    triggerHook();
    expect(mockCallback).toBeCalledTimes(1);
    expect(mockCallback).toBeCalledWith(expectedResult);
  });
});
`;
};
