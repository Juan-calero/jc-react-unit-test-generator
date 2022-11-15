import fs from "fs";
import * as vscode from "vscode";

import { showMessageBanner } from "./message-banner/show-message-banner";
import { recursiveFolderOpener } from "./utils/recursive-folder-opener";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "jcUnitTestGenerator.generateTests",
    async (file: vscode.Uri) => {
      await recursiveFolderOpener(file);

      setTimeout(() => {
        fs.readFile("./log-file", "utf-8", async (err, content) => {
          if (err) throw err;

          showMessageBanner(content);

          fs.writeFile("./log-file", " ", (err) => {
            if (err) throw err;
          });
        });
      }, 100);
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
