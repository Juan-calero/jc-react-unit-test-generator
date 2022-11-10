import { red, green, bold } from "chalk";

export const SINGLE_EXPORT_ERROR =
  red("Error: ") +
  "Please provide a single 'export const' to the file, that exports " +
  bold("either a React Component or a React Hook: ");

export const FILE_EXISTS_ERROR = red("(Error) Test File Already Exists: ");
export const INVALID_PATHNAME_ERROR =
  red("(Error) Invalid Pathname: ") +
  "please provide either .ts or .tsx files: ";

export const SUCCESS_MESSAGE = green("File Generated: ");

export const UNMOCKABLE_IMPORTS = new Set([
  "@xingternal/tokens",
  "@xingternal/icons",
]);
