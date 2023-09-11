import * as vscode from "vscode";
import { OpenAIWrapper } from "./openai";
import { documentFunction } from "./commands";

export function activate(context: vscode.ExtensionContext) {
  // get open windows that are typescript files
  // 
  const command = "vdoc.documentFunction";

  async function initApi() {
    return await OpenAIWrapper.new();
  }

  function applyMiddleware(func: Function) {
    return async (...args: any) => {
      try {
        await initApi();
      } catch (error: any) {
        console.log(error.message);
      }
      return await func(...args);
    };
  }

  context.subscriptions.push(
    vscode.commands.registerCommand(command, applyMiddleware(documentFunction))
  );
}

export function deactivate() { }
