import type { InputChannel } from "./types.js";

const DEBUG = process.env.HUMANCLAW_DEBUG === "true";
const SENTINEL = "<<<END>>>";

export class ConsoleInputChannel implements InputChannel {
  readonly name = "console";

  async getResponse(promptText: string, abortSignal?: AbortSignal): Promise<string> {
    if (DEBUG) console.log(`\n[HumanClaw] getResponse called - ${new Date().toLocaleTimeString()}, stdin.isTTY=${process.stdin.isTTY}, paused=${process.stdin.isPaused()}`);
    
    if (!process.stdin.isTTY) {
      throw new Error("HumanClaw console input requires an interactive terminal.");
    }

    // Display the prompt
    const header = "\n=====HumanClaw Manual Mode, Prompt: =====\n";
    process.stdout.write(header);
    if (promptText.length > 0) {
      process.stdout.write(promptText + "\n");
    } else {
      process.stdout.write("(empty prompt)\n");
    }
    // Calculate timeout deadline
    const deadline = new Date(Date.now() + 120000);
    const timeStr = deadline.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    process.stdout.write(`=====Please type or paste response here, end with <<<END>>> on a new line. (Scroll up to see full prompt above) Waiting until ${timeStr}...\n`);

    return this.readManualResponse(abortSignal);
  }

  private async readManualResponse(abortSignal?: AbortSignal): Promise<string> {
    const TIMEOUT_MS = 120000; // 2 minutes
    const lines: string[] = [];
    let buffer = "";

    return new Promise((resolve, reject) => {
      const onData = (chunk: Buffer) => {
        if (DEBUG) console.log(`[HumanClaw] Data received: ${JSON.stringify(chunk.toString())}`);
        buffer += chunk.toString();
        
        // Process complete lines
        let newlineIndex;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          const line = buffer.slice(0, newlineIndex).replace(/\r$/, ""); // Strip trailing \r
          buffer = buffer.slice(newlineIndex + 1);
          
          if (line.trim() === SENTINEL) {
            cleanup();
            resolve(lines.join("\n").trim());
            return;
          }
          lines.push(line);
        }
      };

      const onAbort = () => {
        cleanup();
        reject(new Error("HumanClaw input aborted."));
      };

      const cleanup = () => {
        process.stdin.off("data", onData);
        process.stdin.pause();
        abortSignal?.removeEventListener?.("abort", onAbort);
        clearTimeout(timeoutId);
      };

      // Setup timeout
      const timeoutId = setTimeout(() => {
        cleanup();
        if (DEBUG) console.log("\n[HumanClaw] Input timed out. OpenClaw may retry or use fallback. Wait or restart gateway if stuck.");
        reject(new Error(`HumanClaw input timed out after ${TIMEOUT_MS / 1000} seconds.`));
      }, TIMEOUT_MS);

      // Start listening
      process.stdin.resume();
      process.stdin.on("data", onData);
      abortSignal?.addEventListener?.("abort", onAbort);
    });
  }
}
