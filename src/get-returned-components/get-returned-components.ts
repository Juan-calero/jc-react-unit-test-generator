import type { ReturnComponentsType } from "../types/return-components-type";

export type GetReturnedComponentsType = (
  content: string
) => ReturnComponentsType;

export const getReturnedComponents: GetReturnedComponentsType = (content) => {
  const exportStartLine = content.slice(content.indexOf("export const "));
  const exportEndLine = exportStartLine.slice(
    0,
    exportStartLine.search(/\n[}|\)];\n/)
  );

  const returnStatement = exportEndLine.lastIndexOf("return ");
  const returnLine = exportEndLine
    .slice(
      returnStatement === -1 ? exportEndLine.indexOf(") => (") : returnStatement
    )
    .split("<");

  // Children Components
  const returnComponents = { parents: {}, children: {} };

  // Deals with return components with children
  returnLine.forEach((componentLine) => {
    if (!componentLine.match(/^(\/[A-Z])/)) return;

    const normalizedName = componentLine.replace(/(\/|>[\s\S]*)/g, "");

    returnComponents.parents[normalizedName] =
      returnComponents.parents[normalizedName] + 1 || 1;
  });

  // Deals with return components with no children
  returnLine.forEach((componentLine) => {
    if (!componentLine.match(/^[A-Z]/)) return;

    const normalizedName = componentLine.replace(/( |>|:|\n)[\s\S]*/g, "");
    if (returnComponents.parents[normalizedName]) return;

    returnComponents.children[normalizedName] =
      returnComponents.children[normalizedName] + 1 || 1;
  });

  return returnComponents;
};
