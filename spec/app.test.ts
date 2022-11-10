import "jest";

const mockGenerateFile = jest.fn();
jest.mock("../src/generate-component-file/generate-file", () => ({
  generateFile: mockGenerateFile,
}));

const mockFsReadFile = jest.fn((__filename, fn) => fn(null, "mockContent"));
jest.mock("fs", () => ({ readFile: mockFsReadFile }));

let mockConsolePrompt: (() => string) | undefined;
jest.mock("prompt-sync", () => jest.fn(() => jest.fn(() => mockConsolePrompt)));

jest.mock("chalk", () => ({
  dim: jest.fn((content) => content),
  red: jest.fn((content) => content),
  bold: jest.fn((content) => content),
  green: jest.fn((content) => content),
}));

const mockConsoleLog = jest.fn();
console.log = mockConsoleLog;

describe("app", () => {
  let triggerCallback: () => void;
  beforeEach(async () => {
    const { app } = await import("../src/app");
    triggerCallback = () => app();
  });

  afterEach(jest.clearAllMocks);

  describe("Skips Reading File:", () => {
    it.each`
      scenario                                 | pathnames
      ${"Folder Path"}                         | ${"nested/folder/path/with/no/file"}
      ${"Folder Path with Trailing Slash"}     | ${"nested/folder/path/with/no/file/"}
      ${"Index TSX File"}                      | ${"file/path/named/index.tsx"}
      ${"Index TypeScript File"}               | ${"file/path/named/index.ts"}
      ${"Index JSX File"}                      | ${"file/path/named/index.jsx"}
      ${"Index JavaScript File"}               | ${"file/path/named/index.js"}
      ${"Styles File Ending in '.styles.tsx'"} | ${"file-path-with-styles-on-it/mock-component.styles.tsx"}
      ${"Styles File Ending in '.styles.ts'"}  | ${"file-path-with-styles-on-it/mock-component.styles.ts"}
      ${"Styles File Ending in '.style.tsx'"}  | ${"file-path-with-styles-on-it/mock-component.style.tsx"}
      ${"Styles File Ending in '.style.ts'"}   | ${"file-path-with-styles-on-it/mock-component.style.ts"}
      ${"Test File Ending in '.test.tsx'"}     | ${"file-path-has-test-on-it/something.test.tsx"}
      ${"Test File Ending in '.test.ts'"}      | ${"file-path-has-test-on-it/something.test.ts"}
      ${"Spec File Ending in '.spec.tsx'"}     | ${"file-path-has-spec-on-it/something.spec.tsx"}
      ${"Spec File Ending in '.spec.ts'"}      | ${"file-path-has-spec-on-it/something.spec.ts"}
      ${"File Inside a '__test__' Folder"}     | ${"file-path-from-test-folder/__test__/mock-component.ts"}
      ${"File Inside a '__spec__' Folder"}     | ${"file-path-from-spec-folder/__spec__/mock-component.ts"}
    `("$scenario", ({ pathnames }) => {
      mockConsolePrompt = pathnames;
      triggerCallback();
      expect(mockFsReadFile).toBeCalledTimes(0);
    });
  });

  describe.each`
    scenario        | pathnames
    ${"Javascript"} | ${"file/path/my-component.js"}
    ${"JSX"}        | ${"file/path/my-component.jsx"}
    ${"JSON"}       | ${"file/path/my-component.json"}
    ${"CSS"}        | ${"file/path/my-component.css"}
    ${"Markdown"}   | ${"file/path/my-component.md"}
  `("Triggers Invalid Pathname Error:", ({ scenario, pathnames }) => {
    beforeEach(() => (mockConsolePrompt = undefined));

    it(`${scenario} file`, () => {
      mockConsolePrompt = pathnames;
      triggerCallback();

      expect(mockFsReadFile).toBeCalledTimes(0);
      expect(mockConsoleLog).toBeCalledTimes(1);
      expect(mockConsoleLog).toBeCalledWith(
        `(Error) Invalid Pathname: please provide either .ts or .tsx files: ${pathnames}`
      );
    });
  });

  describe.each`
    scenario                  | pathnames                        | fileType
    ${"TypeScript Component"} | ${"file/path/my-component.ts"}   | ${"component"}
    ${"TSX Component"}        | ${"file/path/my-component.tsx"}  | ${"component"}
    ${"TypeScript Hook"}      | ${"file/path/use-mock-hook.ts"}  | ${"hook"}
    ${"TSX Hook"}             | ${"file/path/use-mock-hook.tsx"} | ${"hook"}
  `("Generates File:", ({ scenario, pathnames, fileType }) => {
    beforeEach(() => (mockConsolePrompt = pathnames));
    afterEach(() => (mockConsolePrompt = undefined));

    it(`${scenario} file calls fs.readFile correctly`, () => {
      triggerCallback();

      expect(mockFsReadFile).toBeCalledTimes(1);
      expect(mockFsReadFile).toBeCalledWith(pathnames, expect.any(Function));
    });

    it(`${scenario} file calls generateFile correctly`, () => {
      triggerCallback();

      expect(mockGenerateFile).toBeCalledTimes(1);
      expect(mockGenerateFile).toBeCalledWith(
        pathnames,
        "mockContent",
        [],
        fileType
      );
    });
  });
});
