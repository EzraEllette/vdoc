import { ProgramStatement } from "@typescript-eslint/types/dist/generated/ast-spec";
import { getFunctions } from "./parse";
export class TypeScriptParser {
    getFunctions(sourceUri: string): {
        [key: string]: ProgramStatement;
    } {
        return getFunctions(sourceUri);
    }
}