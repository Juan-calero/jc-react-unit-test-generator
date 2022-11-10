import * as vscode from "vscode";
import { app } from "../app";

export const recursiveFolderOpener = async (file) => {
  if (file.path.match(/\./g)) {
    app(file.fsPath);
    return;
  }

  const childrenFiles = await vscode.workspace.fs.readDirectory(file);
  childrenFiles.forEach((childFile) => {
    const childPath = `${file.fsPath}/${childFile[0]}`;

    childFile[0].match(/\./g)
      ? app(childPath)
      : recursiveFolderOpener(vscode.Uri.file(childPath));
  });
};
