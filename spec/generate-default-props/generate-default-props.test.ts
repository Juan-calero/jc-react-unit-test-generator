import { GenerateDefaultPropsType } from "../../src/generate-default-props/generate-default-props";

const mockConvertToPascalCase = jest.fn(() => "mockConvertToPascalCase");
jest.mock("../../src/utils/convert-into-pascal-case", () => ({
  convertToPascalCase: mockConvertToPascalCase,
}));

const mockFormatPropTypePairs = jest.fn(() => "mockFormatPropTypePairs");
jest.mock("../../src/generate-default-props/format-prop-type-pairs", () => ({
  formatPropTypePairs: mockFormatPropTypePairs,
}));

const mockGetExportedComponentTypes = jest.fn(() => [
  "getExportedComponentTypes",
]);
jest.mock(
  "../../src/generate-default-props/get-exported-component-types",
  () => ({
    getExportedComponentTypes: mockGetExportedComponentTypes,
  })
);

const DEFAULT_PROPS = {
  componentName: "MyMockedComponentName",
  content: "mockContent",
  props: ["mockProp1", "mockProp2"],
};

describe("generateDefaultProps", () => {
  let triggerCallback: (
    props?: Partial<Parameters<GenerateDefaultPropsType>[0]>
  ) => ReturnType<GenerateDefaultPropsType>;

  beforeEach(async () => {
    const { generateDefaultProps } = await import(
      "../../src/generate-default-props/generate-default-props"
    );
    triggerCallback = (props) =>
      generateDefaultProps({ ...DEFAULT_PROPS, ...props });
  });

  afterEach(jest.clearAllMocks);

  it("returns expected result", () => {
    const result = triggerCallback();

    expect(result).toStrictEqual(
      "const DEFAULT_PROPS: mockConvertToPascalCaseType = {mockFormatPropTypePairs\n};\n\n"
    );
  });

  describe.each`
    component                      | mockComponent                    | expectedProps
    ${"getExportedComponentTypes"} | ${mockGetExportedComponentTypes} | ${{ componentName: "mockConvertToPascalCase", content: "mockContent" }}
    ${"convertToPascalCase"}       | ${mockConvertToPascalCase}       | ${"MyMockedComponentName"}
    ${"formatPropTypePairs"}       | ${mockFormatPropTypePairs}       | ${{ defaultPropTypes: ["getExportedComponentTypes"], props: DEFAULT_PROPS["props"] }}
  `("$component", ({ mockComponent, expectedProps }) => {
    it("renders with correct params", () => {
      triggerCallback();
      expect(mockComponent).toBeCalledTimes(1);
      expect(mockComponent).toBeCalledWith(expectedProps);
    });
  });
});
