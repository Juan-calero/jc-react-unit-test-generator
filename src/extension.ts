import * as vscode from "vscode";

import { recursiveFolderOpener } from "./utils/recursive-folder-opener";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "jcUnitTestGenerator.generateTests",
    async (file: vscode.Uri) => recursiveFolderOpener(file)
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
