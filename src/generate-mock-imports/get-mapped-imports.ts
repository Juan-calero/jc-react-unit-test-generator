import { UNMOCKABLE_IMPORTS } from "../constants.js";

export type GetMappedImportsType = (
  importStatements: string[]
) => [string, string[]][];

export const getMappedImports: GetMappedImportsType = (importStatements) => {
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

    if (
      !UNMOCKABLE_IMPORTS.some((unmockable_import) =>
        packageName.includes(unmockable_import)
      ) &&
      importedComponents?.[0]
    )
      mappedImports.push([packageName, importedComponents]);
  });

  return mappedImports;
};
