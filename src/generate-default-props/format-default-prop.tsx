import { convertIntoPascalCase } from "../utils/convert-into-pascal-case";

export type FormatDefaultPropType = (props: {
  prop: string;
  defaultPropType?: string;
}) => string;

export const formatDefaultProp: FormatDefaultPropType = ({
  prop,
  defaultPropType,
}) => {
  if (!defaultPropType) return "undefined";

  if (defaultPropType.match(/(\(|\))/g)) return "jest.fn()";
  if (defaultPropType.includes("SetStateAction")) return "jest.fn()";

  if (defaultPropType.includes("string"))
    return `'mock${convertIntoPascalCase(prop)}'`;
  if (defaultPropType.includes("boolean")) return "false";
  if (defaultPropType.includes("number")) return "1";
  if (defaultPropType.includes("null")) return "null";
  return "undefined";
};
