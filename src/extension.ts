import * as vscode from "vscode";
import { app } from "./app";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "jcUnitTestGenerator.generateTests",
    async (file: vscode.Uri) => app(file.fsPath)
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
