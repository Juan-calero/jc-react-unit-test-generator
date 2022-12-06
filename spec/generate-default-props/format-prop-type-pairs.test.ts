import { FormatPropTypePairsType } from "../../src/generate-default-props/format-prop-type-pairs";

const mockFormatDefaultProp = jest.fn(() => "mockFormatDefaultProp");
jest.mock("../../src/generate-default-props/format-default-prop", () => ({
  formatDefaultProp: mockFormatDefaultProp,
}));

const DEFAULT_PROPS = {
  defaultPropTypes: {},
  props: ["mockedPropName"],
};

describe("formatPropTypePairs", () => {
  let triggerCallback: (
    props?: Partial<Parameters<FormatPropTypePairsType>[0]>
  ) => ReturnType<FormatPropTypePairsType>;

  beforeEach(async () => {
    const { formatPropTypePairs } = await import(
      "../../src/generate-default-props/format-prop-type-pairs"
    );
    triggerCallback = (props) =>
      formatPropTypePairs({ ...DEFAULT_PROPS, ...props });
  });

  afterEach(jest.clearAllMocks);

  it.each`
    scenario                       | props                                                                      | expectedResult
    ${"there is 1 prop"}           | ${{ defaultPropTypes: {}, props: ["mockedPropName"] }}                     | ${"\n  mockedPropName: mockFormatDefaultProp,"}
    ${"there is more than 1 prop"} | ${{ defaultPropTypes: {}, props: ["mockedPropName1", "mockedPropName2"] }} | ${"\n  mockedPropName1: mockFormatDefaultProp,\n  mockedPropName2: mockFormatDefaultProp,"}
    ${"there is '}' as a prop"}    | ${{ defaultPropTypes: {}, props: ["}"] }}                                  | ${"\n  },"}
  `("returns correct result when $scenario", ({ props, expectedResult }) => {
    expect(triggerCallback(props)).toStrictEqual(expectedResult);
  });

  describe("formatDefaultProp", () => {
    it("is not called when prop is `}`", () => {
      triggerCallback({ props: ["}"] });
      expect(mockFormatDefaultProp).toBeCalledTimes(0);
    });

    it("is called when there's 1 matching prop", () => {
      triggerCallback({
        defaultPropTypes: { mockedPropName: "mockDefaultPropTypesProp" },
        props: ["mockedPropName"],
      });

      expect(mockFormatDefaultProp).toBeCalledTimes(1);
      expect(mockFormatDefaultProp).toHaveBeenCalledWith({
        defaultPropType: "mockDefaultPropTypesProp",
        prop: "mockedPropName",
      });
    });

    it.each`
      scenario            | props                                                                                                 | expectedResult
      ${"matches"}        | ${{ defaultPropTypes: { mockedPropName2: "mockDefaultPropTypesProp1" }, props: ["mockedPropName1"] }} | ${{ defaultPropType: undefined, prop: "mockedPropName1" }}
      ${"does not match"} | ${{ defaultPropTypes: { mockedPropName1: "mockDefaultPropTypesProp1" }, props: ["mockedPropName1"] }} | ${{ defaultPropType: "mockDefaultPropTypesProp1", prop: "mockedPropName1" }}
    `(
      "is called when defaultPropTypes $scenario the prop",
      ({ props, expectedResult }) => {
        triggerCallback(props);
        expect(mockFormatDefaultProp).toBeCalledTimes(1);
        expect(mockFormatDefaultProp).toHaveBeenCalledWith(expectedResult);
      }
    );
  });
});
