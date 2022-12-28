import fs from "fs";

import { componentTemplate } from "../templates/component-template.js";
import {
  getExportedComponentProps,
  getFilePath,
  getStatements,
} from "../utils";
import { hookTemplate } from "../templates/hook-template.js";

import { generateMockedImports } from "../generate-mock-imports/generate-mocked-imports.js";
import { getReturnedComponents } from "../get-returned-components/get-returned-components.js";

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

  // gets the returned components
  const returnComponents = getReturnedComponents(content);

  // mocks the imports
  const { mockedImports, firstImportName } = generateMockedImports(
    statements,
    returnComponents
  );

  const templateProps = {
    content,
    path,
    props: componentProps,
    mockedImports,
    firstImportName,
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
