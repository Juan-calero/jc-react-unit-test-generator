import { generateDefaultProps } from "../default-props";
import { generateHookHeaderImports } from "../header-imports/generate-hook-header-imports";
import { convertToPascalCase } from "../utils/convert-into-pascal-case";
import type { TemplateType } from "./component-template";

export const hookTemplate: TemplateType = ({
  content,
  firstImportName,
  mockedImports,
  path,
  props,
}) => {
  const componentName = convertToPascalCase(path);
  const hookName = componentName.replace(/^[A-Z]/, (x) => x.toLowerCase());

  const defaultProps = generateDefaultProps({ componentName, props, content });
  const headerImports = generateHookHeaderImports({ componentName, path });

  const itArg1Spacing = " ".repeat(firstImportName.length - 2);
  const itArg2Spacing = " ".repeat(firstImportName.length - 4);

  return `${headerImports}
${mockedImports}
${defaultProps}
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
    callback${itArg1Spacing}| mockCallback${itArg2Spacing}| expectedResult
    \${'${firstImportName}'} | \${mock${firstImportName}} | \${{}}
  \`('$callback', ({ mockCallback, expectedResult }) => {
    triggerHook();
    expect(mockCallback).toBeCalledTimes(1);
    expect(mockCallback).toBeCalledWith(expectedResult);
  });
});
`;
};
