import { convertToPascalCase } from "../utils/convert-into-pascal-case";
import { formatPropTypePairs } from "./format-prop-type-pairs";
import { getExportedComponentTypes } from "./get-exported-component-types";

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
  const pascalComponentName = convertToPascalCase(componentName);

  const defaultPropTypes = getExportedComponentTypes({
    componentName: pascalComponentName,
    content,
  });

  // returns formatted and normalized "prop: type" pairs
  const defaultProps = formatPropTypePairs({ defaultPropTypes, props });

  return `const DEFAULT_PROPS: ${pascalComponentName}Type = {${defaultProps}
};

`;
};
