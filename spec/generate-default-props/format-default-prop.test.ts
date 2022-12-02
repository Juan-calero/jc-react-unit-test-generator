import { FormatDefaultPropType } from "../../src/generate-default-props/format-default-prop";

const mockGetDefaultPropsTypes = jest.fn(() => "mockGetDefaultPropsTypes");
jest.mock("../../src/generate-default-props/get-default-props-types", () => ({
  getDefaultPropsTypes: mockGetDefaultPropsTypes,
}));

const DEFAULT_PROPS = {
  defaultPropType: undefined,
  prop: "mockedPropName",
};

describe("formatDefaultProp", () => {
  let triggerCallback: (
    props?: Partial<Parameters<FormatDefaultPropType>[0]>
  ) => ReturnType<FormatDefaultPropType>;

  beforeEach(async () => {
    const { formatDefaultProp } = await import(
      "../../src/generate-default-props/format-default-prop"
    );
    triggerCallback = (props) =>
      formatDefaultProp({ ...DEFAULT_PROPS, ...props });
  });

  afterEach(jest.clearAllMocks);

  it.each`
    scenario                         | defaultPropType                    | expectedResult
    ${"nothing"}                     | ${undefined}                       | ${"undefined"}
    ${"a full function"}             | ${"() => void"}                    | ${"jest.fn()"}
    ${"the beginning of a function"} | ${"( "}                            | ${"jest.fn()"}
    ${"the end of a function"}       | ${") => void"}                     | ${"jest.fn()"}
    ${"a react setState"}            | ${"React.SetStateAction<Boolean>"} | ${"jest.fn()"}
    ${"string"}                      | ${"string"}                        | ${"'mockMockedPropName'"}
    ${"boolean"}                     | ${"boolean"}                       | ${"false"}
    ${"number"}                      | ${"number"}                        | ${"1"}
    ${"a string with null"}          | ${"null"}                          | ${"null"}
    ${"more than 1 primitive type"}  | ${"boolean | number | null"}       | ${"false"}
    ${"undefined"}                   | ${"undefined"}                     | ${"undefined"}
    ${"a custom type"}               | ${"MyCustomPropType[]"}            | ${"undefined"}
  `(
    "returns `$expectedResult` when defaultPropType contains $scenario",
    ({ defaultPropType, expectedResult }) => {
      expect(triggerCallback({ defaultPropType })).toStrictEqual(
        expectedResult
      );
    }
  );
});
