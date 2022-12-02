import { convertIntoPascalCase } from "../utils/convert-into-pascal-case";
import { formatDefaultProp } from "./format-default-prop";

export type GenerateDefaultPropsType = (props: {
  componentName: string;
  content: string;
  props: string[];
}) => string;

export const generateDefaultProps: GenerateDefaultPropsType = ({
  componentName,
  content,
  props,
}) => {
  const typeExportRegex = new RegExp(
    `^export type ${convertIntoPascalCase(componentName)}.*`,
    "g"
  );

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

  // returns formatted and normalized "prop: type" pairs
  const defaultProps = props
    .map((prop) => {
      const defaultPropType = defaultPropTypes?.[prop];

      if (prop.includes("}")) return `\n  ${prop},`;
      return `\n  ${prop}: ${formatDefaultProp({ prop, defaultPropType })},`;
    })
    .join("");

  return `const DEFAULT_PROPS: ${componentName}Type = {${defaultProps}
};

`;
};
