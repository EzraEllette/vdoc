import * as vscode from "vscode";
import { OpenAIWrapper } from "../openai";
import { TypeScriptParser } from "../parser";
export async function documentFunction(_context: vscode.ExtensionContext) {
    const document = vscode.window.activeTextEditor?.document;
    if (!document) { return; }
    const parser = new TypeScriptParser();
    const functions = parser.getFunctions(document.uri.toString() || ``);
    const selectedFunctionKey = await vscode.window.showQuickPick(
        Object.keys(functions),
        {
            title: `Select a function to document`,
        }
    );

    if (!selectedFunctionKey) {
        return;
    }

    const selectedFunction = functions[selectedFunctionKey];
    const loc = selectedFunction.loc;

    const [start, end] = selectedFunction.range;

    const functionCode = document.getText().slice(start, end);

    const edits = await OpenAIWrapper.getDocumentation(functionCode);

    const edit = new vscode.WorkspaceEdit();
    edit.insert(
        document.uri,
        new vscode.Position(loc.start.line - 1, 0),
        `/*${edits}\n*/\n`
    );

    return vscode.workspace.applyEdit(edit);
}