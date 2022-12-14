import "jest";

import { getExportedComponentProps } from "../../src/utils/get-exported-component-props";

describe("getExportedComponentProps", () => {
  describe("returns error when:", () => {
    it.each`
      statements                                                                               | expectedResult
      ${["there is no export const statement", "no export"]}                                   | ${"error"}
      ${["there is a constant export const", "export const CONSTANT"]}                         | ${"error"}
      ${["there are multiple export const", "export const Component", "export const useHook"]} | ${"error"}
      ${["there is a constant export with let", "export let Component"]}                       | ${"error"}
      ${["there is an export default", "export default const Component"]}                      | ${"error"}
    `("$statements.0", ({ statements, expectedResult }) => {
      expect(getExportedComponentProps(statements)).toStrictEqual(
        expectedResult
      );
    });
  });

  describe("returns array with no props when:", () => {
    it.each`
      statements                                               | expectedResult
      ${["component export", "export const Component = ({})"]} | ${[]}
      ${["Hook export", "export const useHook = ({})"]}        | ${[]}
    `(
      "there is a $statements.0, but there are no props",
      ({ statements, expectedResult }) => {
        expect(getExportedComponentProps(statements)).toStrictEqual(
          expectedResult
        );
      }
    );
  });

  describe("returns array with props when:", () => {
    it.each`
      statements                                                                                                                                                                                                  | expectedResult
      ${["component export, 1 prop", "export const Component = ({ testProp }) => "]}                                                                                                                              | ${["testProp"]}
      ${["Hook export, 1 prop", "export const useHook = ({ testProp }) => "]}                                                                                                                                     | ${["testProp"]}
      ${["component export, multiple props", "export const Component = ({ testProp1, testProp2, testProp3,}) => "]}                                                                                               | ${["testProp1", "testProp2", "testProp3"]}
      ${["Hook export, multiple props", "export const useHook = ({ testProp1, testProp2, testProp3,}) => "]}                                                                                                      | ${["testProp1", "testProp2", "testProp3"]}
      ${["component export, multiple props with default values", "export const Component = ({ testProp1 = '', testProp2 = () => {}, testProp3 = null}) => "]}                                                     | ${["testProp1", "testProp2", "testProp3"]}
      ${["Hook export, multiple props with default values", "export const useHook = ({ testProp1 = '', testProp2 = () => {}, testProp3 = null}) => "]}                                                            | ${["testProp1", "testProp2", "testProp3"]}
      ${["component export, multiple props with renamed values", "export const Component = ({ testProp1: myNewProp1, testProp2: my_new_prop2, testProp3: MY_NEW_PROP3}) => "]}                                    | ${["testProp1", "testProp2", "testProp3"]}
      ${["Hook export, multiple props with renamed values", "export const useHook = ({ testProp1: myNewProp1, testProp2: my_new_prop2, testProp3: MY_NEW_PROP3}) => "]}                                           | ${["testProp1", "testProp2", "testProp3"]}
      ${["component export, multiple props with default and renamed values", "export const Component = ({ testProp1: myNewProp1 = '', testProp2: my_new_prop2 = () => {}, testProp3: MY_NEW_PROP3 = null}) => "]} | ${["testProp1", "testProp2", "testProp3"]}
      ${["Hook export, multiple props with default and renamed values", "export const useHook = ({ testProp1: myNewProp1 = '', testProp2: my_new_prop2 = () => {}, testProp3: MY_NEW_PROP3 = null}) => "]}        | ${["testProp1", "testProp2", "testProp3"]}
      ${["component export, multiple props with object destructuring", "export const Component = ({ testProp1, testProp2: { nestedProp1, nestedProp2 }, testProp3}) => "]}                                        | ${["testProp1", "testProp2: {", "nestedProp1", "nestedProp2", "}", "testProp3"]}
      ${["Hook export, multiple props  with object destructuring", "export const useHook = ({ testProp1, testProp2: { nestedProp1, nestedProp2 }, testProp3}) => "]}                                              | ${["testProp1", "testProp2: {", "nestedProp1", "nestedProp2", "}", "testProp3"]}
      ${["component export, multiple props with spread", "export const Component = ({ testProp1, testProp2, ...testProp3}) => "]}                                                                                 | ${["testProp1", "testProp2"]}
      ${["Hook export, multiple props with spread", "export const useHook = ({ testProp1, testProp2, ...testProp3}) => "]}                                                                                        | ${["testProp1", "testProp2"]}
    `("there is a $statements.0", ({ statements, expectedResult }) => {
      expect(getExportedComponentProps(statements)).toStrictEqual(
        expectedResult
      );
    });
  });
});
