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
      .match(/\({.*}\) =>/)?.[0]
      .replace(/\({|}\)| |=[^,]*|: [A-Za-z][^,]*/g, "")
      .split(",")
      .filter(Boolean) ?? []
  );
};
