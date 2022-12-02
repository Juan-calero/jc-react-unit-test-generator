import { GenerateDefaultPropsType } from "../../src/generate-default-props/generate-default-props";

const mockGetDefaultPropsTypes = jest.fn(() => "mockGetDefaultPropsTypes");
jest.mock("../../src/generate-default-props/get-default-props-types", () => ({
  getDefaultPropsTypes: mockGetDefaultPropsTypes,
}));

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
      "const DEFAULT_PROPS: MyMockedComponentNameType = {mockGetDefaultPropsTypes\n};\n\n"
    );
  });

  describe("getDefaultPropsTypes", () => {
    it("renders with correct params", () => {
      triggerCallback();

      expect(mockGetDefaultPropsTypes).toBeCalledTimes(1);
      expect(mockGetDefaultPropsTypes).toBeCalledWith({
        content: "mockContent",
        props: ["mockProp1", "mockProp2"],
      });
    });
  });
});
