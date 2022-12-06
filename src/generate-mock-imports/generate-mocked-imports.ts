import { formatJestMockedImports } from "./format-jest-mock-imports";
import { getMappedImports } from "./get-mapped-imports";

export type GenerateMockedImportsType = (statements: string[]) => {
  mockedImports: string;
  firstImportName: string;
};

export const generateMockedImports: GenerateMockedImportsType = (
  statements
) => {
  const importStatements = statements.filter((line) =>
    line.match(/^import { [^}]*} from ("|')[^("|')]*("|')/gi)
  );

  const mappedImports = getMappedImports(importStatements);

  return {
    mockedImports: formatJestMockedImports(mappedImports),
    firstImportName: mappedImports[0]?.[1]?.[0] || "",
  };
};
