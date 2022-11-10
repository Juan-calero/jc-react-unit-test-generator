import fs from "fs";
import * as vscode from "vscode";

import { componentTemplate } from "../templates/component-template.js";
import {
  getExportedComponentProps,
  getFilePath,
  getStatements,
} from "../utils";
import { hookTemplate } from "../templates/hook-template.js";
import {
  SINGLE_EXPORT_ERROR,
  FILE_EXISTS_ERROR,
  SUCCESS_MESSAGE,
} from "../constants";

import { generateMockedImports } from "./get-mocked-imports.js";
import { convertIntoPascalCase } from "../utils/convert-into-pascal-case.js";

export type GenerateFileType = (
  pathname: string,
  content: Buffer,
  errorMessages: [string, string][],
  type: "hook" | "component"
) => void;

export const generateFile: GenerateFileType = (
  pathname,
  content,
  errorMessages,
  type
) => {
  const statements = getStatements(content.toString());
  const { testFilePath, path } = getFilePath(pathname);

  const componentProps = getExportedComponentProps(statements);
  if (componentProps === "error") {
    vscode.window.showErrorMessage(SINGLE_EXPORT_ERROR);
    errorMessages.push([SINGLE_EXPORT_ERROR, pathname]);
    return;
  }

  // mocks the imports
  const mockImports = generateMockedImports(statements);
  if (!mockImports.mockedImports || !mockImports.firstImportName) return;
  const componentName = convertIntoPascalCase(path);

  const templateProps = {
    componentName,
    path,
    props: componentProps,
    mockedImports: mockImports.mockedImports,
    firstImportName: mockImports.firstImportName,
  };

  const newFile =
    type === "component"
      ? componentTemplate(templateProps)
      : hookTemplate(templateProps);

  if (newFile)
    fs.writeFile(testFilePath, newFile, { flag: "wx" }, (error) => {
      if (error?.errno === -17) {
        vscode.window.showErrorMessage(FILE_EXISTS_ERROR);
      } else if (error) {
        vscode.window.showErrorMessage(error?.message);
      } else {
        vscode.window.showInformationMessage(SUCCESS_MESSAGE);
      }
    });
};
