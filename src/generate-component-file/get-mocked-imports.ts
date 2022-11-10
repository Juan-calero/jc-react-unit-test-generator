import { UNMOCKABLE_IMPORTS } from "../constants.js";

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

  const mappedImports: [string, string[]][] = [];

  importStatements.map((entry) => {
    const importedComponents =
      entry
        .match(/{.*}/gm)?.[0]
        .replace(/{|}| /g, "")
        .trim()
        .split(",")
        .filter(Boolean)
        .filter((component) => component.toUpperCase() !== component) || [];

    const packageName =
      entry.match(/('|").*('|")/gm)?.[0].replace(/('|")/g, "") || "";

    if (!UNMOCKABLE_IMPORTS.has(packageName) && importedComponents?.[0])
      mappedImports.push([packageName, importedComponents]);
  });

  const capitalize = (component: string): string =>
    component[0].toUpperCase() + component.substring(1);

  // generates the mock for each import
  let mockedImports = mappedImports
    .map(([key, value]) => {
      const mockedComponents = value.reduce(
        (acc, component) =>
          (acc += component.match(/^[A-Z]/g)
            ? `\nconst mock${component} = jest.fn(() => <span>${component}</span>);`
            : `\nconst mock${capitalize(component)} = jest.fn();`),
        ""
      );

      const jestMock = value.reduce(
        (acc, component) =>
          (acc += `\n  ${component}: mock${capitalize(component)},`),
        ""
      );

      return `${mockedComponents}\njest.mock("${key}", () => ({${jestMock}\n}));`;
    })
    .join("\n");
  return { mockedImports, firstImportName: mappedImports[0]?.[1]?.[0] || "" };
};
