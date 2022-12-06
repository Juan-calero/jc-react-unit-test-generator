import { convertToPascalCase } from "../utils/convert-into-pascal-case";

export type FormatJestMockedImportsType = (
  mappedImports: [string, string[]][]
) => string;

// generates the mock for each import
export const formatJestMockedImports: FormatJestMockedImportsType = (
  mappedImports
) =>
  mappedImports
    .map(([key, value]) => {
      const mockedComponents = value.reduce(
        (acc, component) =>
          (acc += component.match(/^[A-Z]/g)
            ? `\nconst mock${component} = jest.fn(() => <span>${component}</span>);`
            : `\nconst mock${convertToPascalCase(component)} = jest.fn();`),
        ""
      );

      const jestMock = value.reduce(
        (acc, component) =>
          (acc += `\n  ${component}: mock${convertToPascalCase(component)},`),
        ""
      );

      return `${mockedComponents}\njest.mock('${key}', () => ({${jestMock}\n}));`;
    })
    .join("\n");
