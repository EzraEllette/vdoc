import { Configuration, OpenAIApi } from "openai";
import * as vscode from "vscode";
import wrapText = require("wrap-text");

export class OpenAIWrapper extends OpenAIApi {
    static api: OpenAIWrapper;
    constructor(configuration: Configuration) {
        super(configuration);
    }

/*
This function is used to create a new instance of the OpenAIWrapper class with a
given Configuration object. It first retrieves an API key from an external
source, then creates a new Configuration object with the API key and uses it to
create a new OpenAIWrapper instance.
*/
    static async new() {
        const config: Configuration = new Configuration({
            apiKey: await this.getApiKey()
        });
        this.api = new OpenAIWrapper(config);
    }

    static async getApiKey() {
        await this.verifyAPIKey();
        const config = vscode.workspace.getConfiguration(`vdoc`);
        return config.get<string>(`apiKey`);
    }

    static async verifyAPIKey() {
        const config = vscode.workspace.getConfiguration(`vdoc`);
        const apiKey = config.get<string>(`apiKey`);
        try {
            await this.api.listModels();
        } catch (error: any) {
            console.log(error.message);
        }

        if (!apiKey) {
            const newApiKey = await vscode.window.showInputBox({
                title: "vDoc setup",
                prompt: "Enter your OpenAI API key.",
            });

            if (!newApiKey) {
                throw new Error(`vDoc - OpenAI API key not provided`);
            }
            await config.update(`apiKey`, newApiKey, vscode.ConfigurationTarget.Global);
        }
    }

    static async getDocumentation(functionCode: string): Promise<string> {
        const completion = await this.api.createCompletion({
            model: "gpt-4`",
            prompt: functionCode + `\n"""\nDocument the above function:\n`,
            temperature: 0.34,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            max_tokens: 1000,
            stop: ['"""'],
        });
        let res =
            wrapText(completion.data.choices.map(({ text }) => text).join(`\n`)) ||
            `negative`;
        return res;
    }
}