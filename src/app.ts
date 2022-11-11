import { generateFile } from "./generate-component-file/generate-file";
import fs from "fs";
import { INVALID_PATHNAME_ERROR } from "./constants";
import vscode from "vscode";

export type AppType = (pathname: string) => void;

export const app: AppType = (pathname) => {
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
    vscode.window.showErrorMessage(INVALID_PATHNAME_ERROR);
    return;
  }

  try {
    const data = fs.readFileSync(pathname, "utf-8");
    const fileType = pathname.match(/\/use/gi) ? "hook" : "component";
    generateFile(pathname, data, fileType);
  } catch (err) {
    throw err;
  }
};
