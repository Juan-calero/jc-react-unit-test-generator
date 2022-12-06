import "jest";

import { convertToPascalCase } from "../../src/utils/convert-into-pascal-case";

describe("convertToPascalCase", () => {
  describe("Converts Correctly:", () => {
    it.each`
      kebabCaseString                                           | expectedResult
      ${"oneliner"}                                             | ${"Oneliner"}
      ${"simple-kebab"}                                         | ${"SimpleKebab"}
      ${"really-god-damn-log-kebab-case"}                       | ${"ReallyGodDamnLogKebabCase"}
      ${"Kebab-case-that-somehow-already-starts-in-upper-case"} | ${"KebabCaseThatSomehowAlreadyStartsInUpperCase"}
      ${"CONVERTS_SCREAMING_KEBAB_CASE_ASWELL"}                 | ${"ConvertsScreamingKebabCaseAswell"}
      ${"converts_snake_case_aswell"}                           | ${"ConvertsSnakeCaseAswell"}
      ${"CONVERTS_SCREAMING_SNAKE_CASE_ASWELL"}                 | ${"ConvertsScreamingSnakeCaseAswell"}
      ${"PascalCaseString"}                                     | ${"PascalCaseString"}
    `(
      "$expectedResult from $kebabCaseString",
      ({ kebabCaseString, expectedResult }) => {
        expect(convertToPascalCase(kebabCaseString)).toStrictEqual(
          expectedResult
        );
      }
    );
  });
});
