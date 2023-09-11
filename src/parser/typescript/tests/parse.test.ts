import { ProgramStatement } from "@typescript-eslint/types/dist/generated/ast-spec";
import * as fs from "fs";
import * as estree from "@typescript-eslint/typescript-estree";

const filePath = "/Users/ezraellette/Documents/vdoc/src/parser/typescript/tests/testFunc.ts";

const contents = fs.readFileSync(filePath);

const parsedCode = estree.parse(contents.toString(), {
    loc: true,
    range: true,
});

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
