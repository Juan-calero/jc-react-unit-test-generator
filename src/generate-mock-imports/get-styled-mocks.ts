import type { ReturnComponentsType } from "../types/return-components-type";

export type GetStyledMocksType = (returnComponents: ReturnComponentsType) => {
  styledComponentMocks: string;
  jestStyledMocks: string;
};

// generates the mock for each import
export const getStyledMocks: GetStyledMocksType = (returnComponents) => {
  const allReturnedComponents = {
    ...returnComponents.children,
    ...returnComponents.parents,
  };

  const styledComponentNames = Object.keys(allReturnedComponents)
    .filter((component) => component.includes("Styled."))
    .map((component) => component.replace("Styled.", ""));

  return {
    styledComponentMocks: styledComponentNames.reduce((acc, component) => {
      return (acc += returnComponents.parents["Styled." + component])
        ? `\nconst mock${component} = jest.fn(({ children }) => children);`
        : `\nconst mock${component} = jest.fn(() => <span>${component}</span>);`;
    }, ""),
    jestStyledMocks: styledComponentNames.reduce(
      (acc, component) => (acc += `\n    ${component}: mock${component},`),
      ""
    ),
  };
};
