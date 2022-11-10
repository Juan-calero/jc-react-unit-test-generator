import "jest";

import { getStatements } from "../../src/utils/get-statements";

describe("getStatements", () => {
  it.each`
    content                                                                                 | expectedResult
    ${"one-line of content. no semicolon."}                                                 | ${["one-line of content. no semicolon."]}
    ${"one statement of content, with semicolon;"}                                          | ${["one statement of content, with semicolon"]}
    ${"      one statement of content, with semicolon and empty spaces       ;"}            | ${["one statement of content, with semicolon and empty spaces"]}
    ${"two statements of content on the same line; both with semicolon;"}                   | ${["two statements of content on the same line", "both with semicolon"]}
    ${"two statements of content on different lines;\n both with semicolon;\n"}             | ${["two statements of content on different lines", "both with semicolon"]}
    ${"two statements with multiple paragraphs in between;\n\n\n\n both with semicolon;\n"} | ${["two statements with multiple paragraphs in between", "both with semicolon"]}
    ${"\t\n;\nmultiple;\n statements;\n with;\n semicolons;\n\tand;\n\n\n\n\t\t\t  tabs;"}  | ${["multiple", "statements", "with", "semicolons", "and", "tabs"]}
  `(
    "returns correct statements when content is '$expectedResult'",
    ({ content, expectedResult }) => {
      expect(getStatements(content)).toStrictEqual(expectedResult);
    }
  );
});
