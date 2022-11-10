export type convertIntoPascalCaseType = (kebabCaseString: string) => string;

export const convertIntoPascalCase: convertIntoPascalCaseType = (
  kebabCaseString
) => {
  const normalizedString =
    kebabCaseString === kebabCaseString.toUpperCase()
      ? kebabCaseString.toLowerCase()
      : kebabCaseString;

  return normalizedString
    .replace(/^[a-z]|\-[a-z]|\_[a-z]/g, (x) => x.toUpperCase())
    .replace(/\-|\_/g, "");
};
