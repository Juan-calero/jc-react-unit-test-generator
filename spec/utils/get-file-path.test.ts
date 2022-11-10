import "jest";

import { getFilePath } from "../../src/utils/get-file-path";

describe("getFilePath", () => {
  describe("valid fileName", () => {
    it.each`
      pathname                                                                                                | testFilePath                                                                         | path
      ${"really-really-big-file-path-name.ts"}                                                                | ${"./really-really-big-file-path-name.test.tsx"}                                     | ${"really-really-big-file-path-name"}
      ${"really/deeply/nested/file/path/name.ts"}                                                             | ${"./really/deeply/nested/file/path/name.test.tsx"}                                  | ${"name"}
      ${"file.path.name.with.too.many.extensions"}                                                            | ${"./file.test.tsx"}                                                                 | ${"file"}
      ${"really/deeply/nested/file/path/with/really-really-big-file-path-name.with.with.too.many.extensions"} | ${"./really/deeply/nested/file/path/with/really-really-big-file-path-name.test.tsx"} | ${"really-really-big-file-path-name"}
    `(
      "'$pathname' returns correct testFilePath and path",
      ({ pathname, path, testFilePath }) => {
        expect(getFilePath(pathname)).toStrictEqual({
          path,
          testFilePath,
        });
      }
    );
  });

  describe("invalid fileName", () => {
    it.each`
      pathname
      ${"folder/pathname/with/final/slash/"}
      ${"folder/pathname/with/no/final/slash"}
    `("'$pathname' returns empty path and testFilePath", ({ pathname }) => {
      expect(getFilePath(pathname)).toStrictEqual({
        path: "",
        testFilePath: "",
      });
    });
  });
});
