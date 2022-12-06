import { formatDefaultProp } from "./format-default-prop";

export type FormatPropTypePairsType = (props: {
  defaultPropTypes: Record<string, string>;
  props: string[];
}) => string;

// returns formatted and normalized "prop: type" pairs
export const formatPropTypePairs: FormatPropTypePairsType = ({
  defaultPropTypes,
  props,
}) =>
  props
    .map((prop) => {
      const defaultPropType = defaultPropTypes?.[prop];

      if (prop.includes("}")) return `\n  },`;
      return `\n  ${prop}: ${formatDefaultProp({ prop, defaultPropType })},`;
    })
    .join("");
