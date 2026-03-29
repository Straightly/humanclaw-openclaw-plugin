import { createInterface } from "node:readline";
import type { InputChannel } from "./types.js";

const SENTINEL = "<<<END>>>";

export class ConsoleInputChannel implements InputChannel {
  readonly name = "console";

  async getResponse(promptText: string, abortSignal?: AbortSignal): Promise<string> {
    if (!process.stdin.isTTY) {
      throw new Error("HumanClaw console input requires an interactive terminal.");
    }

    // Display the prompt
    const header =
      "\n=====HumanClaw Manual Mode, Prompt: =====\n";

    process.stdout.write(header);
    if (promptText.length > 0) {
      process.stdout.write(promptText + "\n");
    } else {
      process.stdout.write("(empty prompt)\n");
    }
    process.stdout.write("=====Please type or paste response here, end with <<<END>>> on a new seperated line to end the response.  Waiting...\n");

    // Read the response
    return this.readManualResponse(abortSignal);
  }

  private async readManualResponse(abortSignal?: AbortSignal): Promise<string> {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    const lines: string[] = [];

    let aborted = false;
    const onAbort = () => {
      aborted = true;
      rl.close();
    };
    abortSignal?.addEventListener?.("abort", onAbort);

    return new Promise((resolve, reject) => {
      rl.on("line", (line) => {
        if (line.trim() === SENTINEL) {
          rl.close();
          return;
        }
        lines.push(line);
      });

      rl.on("close", () => {
        abortSignal?.removeEventListener?.("abort", onAbort);
        if (aborted) {
          reject(new Error("HumanClaw input aborted."));
          return;
        }
        resolve(lines.join("\n").trim());
      });
    });
  }
}
