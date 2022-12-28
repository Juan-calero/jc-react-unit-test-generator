import { generateDefaultProps } from "../default-props/generate-default-props";
import { convertToPascalCase } from "../utils/convert-into-pascal-case";
import { generateComponentHeaderImports } from "../header-imports/generate-component-header-imports";

export type TemplateType = (props: {
  content: string;
  path: string;
  props: string[];
  mockedImports: string;
  firstImportName: string;
}) => string;

export const componentTemplate: TemplateType = ({
  content,
  path,
  props,
  mockedImports,
  firstImportName,
}) => {
  const componentName = convertToPascalCase(path);

  const defaultProps = generateDefaultProps({ componentName, props, content });
  const headerImports = generateComponentHeaderImports({ componentName, path });

  const describeArg1Spacing = " ".repeat(firstImportName.length - 3);
  const describeArg2Spacing = " ".repeat(firstImportName.length - 5);

  return `${headerImports}
${mockedImports}
${defaultProps}
describe('${componentName}', () => {
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
