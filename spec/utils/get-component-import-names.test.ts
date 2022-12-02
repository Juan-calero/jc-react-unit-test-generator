import "jest";

import { getComponentImportNames } from "../../src/utils/get-component-import-names";

describe("getComponentImportNames", () => {
  describe("Valid Import", () => {
    it.each`
      entry                                                                                                | expectedResult
      ${"import { MockComponent1 } from 'mockPathName'"}                                                   | ${["MockComponent1"]}
      ${"import { MockComponent1 as RenamedMockComponent1 } from 'mockPathName'"}                          | ${["MockComponent1"]}
      ${"import { MockComponent1, MockComponent2,  } from 'mockPathName'"}                                 | ${["MockComponent1", "MockComponent2"]}
      ${"import { MockComponent1, MockComponent2, MOCK_CONSTANT_IN_SCREAMING_SNAKE } from 'mockPathName'"} | ${["MockComponent1", "MockComponent2"]}
      ${"import mockDefaultImport, { MockComponent1, MockComponent2,  } from 'mockPathName'"}              | ${["MockComponent1", "MockComponent2"]}
    `(
      "'$pathname' returns correct testFilePath and path",
      ({ entry, expectedResult }) => {
        expect(getComponentImportNames(entry)).toStrictEqual([
          expectedResult,
          "mockPathName",
        ]);
      }
    );
  });

  describe("Invalid Import", () => {
    it.each`
      scenario                                              | entry
      ${"Default Import, single quotes"}                    | ${"import mockDefaultImport from 'mockPathName'"}
      ${"Default Import, double quotes"}                    | ${'import mockDefaultImport from "mockPathName"'}
      ${"Import * as ..., single quotes"}                   | ${"import * as mockDefaultImport from 'mockPathName'"}
      ${"Import * as ..., double quotes "}                  | ${'import * as mockDefaultImport from "mockPathName"'}
      ${"SCREAMING_SNAKE_CASE Named Import, single quotes"} | ${"import { MOCK_CONSTANT_IMPORT } from 'mockPathName'"}
      ${"SCREAMING_SNAKE_CASE Named Import, double quotes"} | ${'import { MOCK_CONSTANT_IMPORT } from "mockPathName"'}
      ${"Package-only Import, single quotes"}               | ${"import 'mockPathName'"}
      ${"Package-only Import, double quotes"}               | ${'import "mockPathName"'}
    `("$scenario", ({ entry }) => {
      expect(getComponentImportNames(entry)).toStrictEqual([
        [],
        "mockPathName",
      ]);
    });
  });
});
