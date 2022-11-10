export type GetFilePathType = (pathname: string) => {
  testFilePath: string;
  path: string;
};

export const getFilePath: GetFilePathType = (pathname) => {
  const splitPathName = pathname.split(".");
  if (!splitPathName[1]) return { testFilePath: "", path: "" };

  return {
    testFilePath: `./${splitPathName[0]}.test.tsx`,
    path: splitPathName[0].split("/").pop() ?? splitPathName[0],
  };
};
