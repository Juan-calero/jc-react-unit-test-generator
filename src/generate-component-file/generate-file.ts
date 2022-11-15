import fs from "fs";

import { componentTemplate } from "../templates/component-template.js";
import {
  getExportedComponentProps,
  getFilePath,
  getStatements,
} from "../utils";
import { hookTemplate } from "../templates/hook-template.js";

import { generateMockedImports } from "./get-mocked-imports.js";
import { convertIntoPascalCase } from "../utils/convert-into-pascal-case.js";

export type GenerateFileType = (
  pathname: string,
  content: string,
  type: "hook" | "component"
) => void;

export const generateFile: GenerateFileType = (pathname, content, type) => {
  const statements = getStatements(content);
  const { testFilePath, path } = getFilePath(pathname);

  const componentProps = getExportedComponentProps(statements);
  if (componentProps === "error") {
    fs.appendFile("./log-file", "SINGLE_EXPORT_ERROR", (error) => {
      if (error) throw error;
    });
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

  if (newFile) {
    fs.writeFile(testFilePath, newFile, { flag: "wx" }, (error) => {
      if (error?.errno === -17) {
        fs.appendFile("./log-file", "FILE_EXISTS_ERROR", (error) => {
          if (error) throw error;
        });
      } else if (error) {
        throw error;
      } else {
        fs.appendFile("./log-file", "success,", (error) => {
          if (error) throw error;
        });
      }
    });
  }
};
