import type { ReturnComponentsType } from "../types/return-components-type";
import { formatJestMockedImports } from "./format-jest-mock-imports";
import { getMappedImports } from "./get-mapped-imports";

export type GenerateMockedImportsType = (
  statements: string[],
  returnComponents: ReturnComponentsType
) => {
  mockedImports: string;
  firstImportName: string;
};

export const generateMockedImports: GenerateMockedImportsType = (
  statements,
  returnComponents
) => {
  const importStatements = statements.filter((line) =>
    line.match(/^import { [^}]*} from ("|')[^("|')]*("|')/gi)
  );

  const mappedImports = getMappedImports(importStatements);

  return {
    mockedImports: formatJestMockedImports(mappedImports, returnComponents),
    firstImportName: mappedImports[0]?.[1]?.[0] || "",
  };
};
