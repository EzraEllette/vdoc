import * as vscode from "vscode";
import * as estree from "@typescript-eslint/typescript-estree";
import { ProgramStatement } from "@typescript-eslint/types/dist/generated/ast-spec";

/**
 * @param _sourceUri
 * @returns 
 * @description
 * This function is used to retrieve all functions from the active editor.
 **/
export function getFunctions(_sourceUri: string): {
    [key: string]: ProgramStatement;
} {
    const document = vscode.window.activeTextEditor?.document;
    if (document === undefined) {
        vscode.window.showInformationMessage(`no active editor`);
        return {};
    }

    const parsedCode = estree.parse(document.getText(), {
        loc: true,
        range: true,
    });

    if (!parsedCode) {
        vscode.window.showInformationMessage(`This document isn't compatible with vDoc yet.`);
        return {};
    }

    const functions: {
        [key: string]: ProgramStatement;
    } = {};

    let nodes: any[] = [...parsedCode.body];

    let a: any = nodes.pop();

    while (a) {
        const types = [
            "ArrowFunctionExpression",
            "FunctionDeclaration",
            "FunctionExpression",
            "MethodDefinition",
        ];

        if (a.body) {
            if (Array.isArray(a.body)) {
                nodes.push(...a.body);
            } else {
                nodes.push(a.body);
            }
        }

        if (a.init) {
            nodes.push(a.init);
            if (types.includes(a.init.type)) {
                a.init.id = a.id;
            }
        }

        if (a.declarations) {
            if (Array.isArray(a.declarations)) {
                nodes.push(...a.declarations);
            } else {
                nodes.push(a.declarations);
            }
        }

        if (a.declaration) {
            nodes.push(a.declaration);
        }

        if (types.includes(a.type)) {
            if (a.key) {
                functions[a.key.name] = a;
            } else {
                functions[a.id.name] = a;
            }
        }

        a = nodes.pop();
    }

    return functions;
}