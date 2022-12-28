export type GetExportedComponentTypesType = (props: {
  componentName: string;
  content: string;
}) => Record<string, string>;

export const getExportedComponentTypes: GetExportedComponentTypesType = ({
  componentName,
  content,
}) => {
  const typeExportRegex = new RegExp(`^export type ${componentName}.*`, "g");

  const componentTypes = content
    // Get the export Type
    .split(/\n\n/g)
    .filter((line) => line.match(typeExportRegex))[0]
    .split(";")
    // Extracts only the child props with their types
    .map((propType) =>
      propType
        .replace(/[\S\s]* {/, "")
        .replace(/\n|}/g, "")
        .trim()
    )
    .filter(Boolean);

  // When no type is returned
  /* if (!componentTypes[0]) return "NO_TYPES_FOUND"; */

  const defaultPropTypes: Record<string, string> = {};

  // Return Object, where the key is the name of the value is it's type
  componentTypes.map((prop) => {
    const propName = prop.replace(/(:.*|\?.*)/, "");
    const propType = prop.replace(/.*: /, "");

    defaultPropTypes[propName] = propType;
  });

  return defaultPropTypes;
};
