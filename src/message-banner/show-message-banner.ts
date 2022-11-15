import * as vscode from "vscode";
import {
  FILE_EXISTS_ERROR,
  INVALID_PATHNAME_ERROR,
  SINGLE_EXPORT_ERROR,
  SUCCESS_MESSAGE,
} from "./message-banner-constants";

export const showMessageBanner = (content: string) => {
  if (content.match(/success/g)) {
    vscode.window.showInformationMessage(
      String(content.match(/success/g)?.length) + SUCCESS_MESSAGE
    );
  }

  if (content.match(/FILE_EXISTS_ERROR/g)) {
    vscode.window.showErrorMessage(
      String(content.match(/FILE_EXISTS_ERROR/g)?.length) + FILE_EXISTS_ERROR
    );
  } else if (content.match(/SINGLE_EXPORT_ERROR/g)) {
    vscode.window.showErrorMessage(
      String(content.match(/SINGLE_EXPORT_ERROR/g)?.length) +
        SINGLE_EXPORT_ERROR
    );
  } else if (!content.match(/success/g)) {
    vscode.window.showErrorMessage(INVALID_PATHNAME_ERROR);
  }
};
