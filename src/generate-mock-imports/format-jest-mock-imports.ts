import type { ReturnComponentsType } from "../types/return-components-type";
import { convertToPascalCase } from "../utils/convert-into-pascal-case";
import { getStyledMocks } from "./get-styled-mocks";

export type FormatJestMockedImportsType = (
  mappedImports: [string, string[]][],
  returnComponents: ReturnComponentsType
) => string;

// generates the mock for each import
export const formatJestMockedImports: FormatJestMockedImportsType = (
  mappedImports,
  returnComponents
) => {
  const { styledComponentMocks, jestStyledMocks } =
    getStyledMocks(returnComponents);

  return mappedImports
    .map(([key, value]) => {
      const mockedComponents = value.reduce((acc, component) => {
        if (component === "Styled") return (acc += styledComponentMocks);

        if (returnComponents.parents[component])
          return (acc += `\nconst mock${component} = jest.fn(({ children }) => children);`);

        if (returnComponents.children[component])
          return (acc += `\nconst mock${component} = jest.fn(() => <span>${component}</span>);`);

        return (acc += `\nconst mock${convertToPascalCase(
          component
        )} = jest.fn();`);
      }, "");

      const jestMock = value.reduce(
        (acc, component) =>
          (acc +=
            component === "Styled"
              ? `\n  Styled: {${jestStyledMocks}\n  },`
              : `\n  ${component}: mock${convertToPascalCase(component)},`),
        ""
      );

      return `${mockedComponents}\njest.mock('${key}', () => ({${jestMock}\n}));`;
    })
    .join("\n");
};
