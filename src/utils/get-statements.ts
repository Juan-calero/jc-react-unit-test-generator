export type GetStatementsType = (content: string) => string[];

export const getStatements: GetStatementsType = (content) =>
  content
    .replace(/\n/g, "")
    .split(";")
    .map((statement: string) => statement.trim())
    .filter(Boolean);
