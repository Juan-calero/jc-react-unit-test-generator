export type GetExportedComponentPropsType = (
  statements: string[]
) => string[] | "error";

export const getExportedComponentProps: GetExportedComponentPropsType = (
  statements
) => {
  const componentExport = statements.filter((line) =>
    line.match(/^export const (([A-Z][a-z])|(use)).*/g)
  );

  if (!componentExport[0] || componentExport[1]) return "error";

  return (
    componentExport[0]
      // Get the props from the component
      .match(/\({.*}\) => /)?.[0]
      // Remove spread, default and renamed props
      .replace(/\({|}\)| |=[^,]*|: [A-Za-z][^,]*|\.\.\.[^,]*/g, "")
      // Formatting Object destructuring
      .replace(/:{/g, ": {,")
      .replace(/}/g, ",}")
      .split(",")
      .filter(Boolean) ?? []
  );
};
