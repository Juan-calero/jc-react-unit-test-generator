export type GetComponentImportNamesType = (entry: string) => [string[], string];

export const getComponentImportNames: GetComponentImportNamesType = (entry) => {
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

  return [importedComponents, packageName];
};
