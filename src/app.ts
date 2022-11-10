import { generateFile } from "./generate-component-file/generate-file";
import fs from "fs";
import { INVALID_PATHNAME_ERROR } from "./constants";
import vscode from "vscode";

export type AppType = (pathname: string) => void;

export const app: AppType = (pathname) => {
  let errorMessages: [string, string][] = [];

  /*  pathnames.split("\r").forEach((pathname) => { */
  // skip folder pathnames
  if (!pathname.includes(".")) return;

  // skip test and index pathnames
  if (
    pathname.match(
      /(\.test\.|\.spec\.|\_\_test\_\_|\_\_spec\_\_|index\.|\.styles\.|\.style\.)/i
    )
  )
    return;

  const matchedFiles = pathname.match(/(\.tsx|\.ts)$/i);

  if (!matchedFiles) {
    errorMessages.push([INVALID_PATHNAME_ERROR, pathname]);
    return;
  }

  fs.readFile(pathname, (error, content) => {
    if (error) throw error;

    const fileType = pathname.match(/\/use/gi) ? "hook" : "component";
    generateFile(pathname, content, errorMessages, fileType);
  });
  /* }); */

  errorMessages.forEach(([errorMessage, pathname]) =>
    vscode.window.showErrorMessage(errorMessage + pathname)
  );
};
