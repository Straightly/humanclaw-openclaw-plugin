import { createInterface } from "node:readline";
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { createAssistantMessageEventStream } from "@mariozechner/pi-ai";
import type { StreamFn } from "@mariozechner/pi-agent-core";

const PROVIDER_ID = "humanclaw";
const MODEL_ID = "manual";
const SENTINEL = "<<<END>>>";

function estimateTokens(text: string): number {
  // Very rough heuristic: ~4 chars/token for English.
  return Math.max(0, Math.ceil(text.length / 4));
}

function buildUsage(inputTokens: number, outputTokens: number) {
  const total = inputTokens + outputTokens;
  return {
    input: inputTokens,
    output: outputTokens,
    cacheRead: 0,
    cacheWrite: 0,
    totalTokens: total,
    cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 },
  };
}

function formatContent(content: unknown): string {
  if (typeof content === "string") {
    return content;
  }
  if (Array.isArray(content)) {
    const blocks = content
      .map((block) => {
        if (block && typeof block === "object" && (block as { type?: string }).type === "text") {
          return String((block as { text?: unknown }).text ?? "");
        }
        return "";
      })
      .filter(Boolean);
    if (blocks.length > 0) {
      return blocks.join("");
    }
  }
  try {
    return JSON.stringify(content, null, 2);
  } catch {
    return String(content ?? "");
  }
}

function buildManualPrompt(context: { systemPrompt?: string; messages?: unknown[] }): string {
  const lines: string[] = [];
  if (context.systemPrompt) {
    lines.push("[system]\n" + context.systemPrompt.trim());
  }
  const messages = Array.isArray(context.messages) ? context.messages : [];
  for (const msg of messages) {
    if (!msg || typeof msg !== "object") {
      continue;
    }
    const role = String((msg as { role?: string }).role ?? "user");
    const content = formatContent((msg as { content?: unknown }).content);
    lines.push(`[${role}]\n${content}`.trim());
  }
  return lines.join("\n\n").trim();
}

async function readManualResponse(abortSignal?: AbortSignal): Promise<string> {
  if (!process.stdin.isTTY) {
    throw new Error("HumanClaw requires an interactive terminal for manual input.");
  }

  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const lines: string[] = [];

  let aborted = false;
  const onAbort = () => {
    aborted = true;
    rl.close();
  };
  abortSignal?.addEventListener?.("abort", onAbort);

  return await new Promise((resolve, reject) => {
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

function createManualStreamFn(): StreamFn {
  return (model, context, options) => {
    const stream = createAssistantMessageEventStream();

    const run = async () => {
      try {
        const promptText = buildManualPrompt(context ?? {});
        const header =
          "\n=== HumanClaw Manual Mode ===\n" +
          "Copy the prompt below into any chatbot.\n" +
          `Paste the response here and end with ${SENTINEL}.\n\n`;

        process.stdout.write(header);
        if (promptText.length > 0) {
          process.stdout.write(promptText + "\n\n");
        } else {
          process.stdout.write("(empty prompt)\n\n");
        }

        const responseText = await readManualResponse(options?.signal);
        const inputTokens = estimateTokens(promptText);
        const outputTokens = estimateTokens(responseText);

        const assistantMessage = {
          role: "assistant",
          content: [{ type: "text", text: responseText }],
          stopReason: "stop",
          api: model.api,
          provider: model.provider,
          model: model.id,
          usage: buildUsage(inputTokens, outputTokens),
          timestamp: Date.now(),
        };

        stream.push({
          type: "done",
          reason: "stop",
          message: assistantMessage,
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        const errorMessageBlock = {
          role: "assistant",
          content: [],
          stopReason: "error",
          api: model.api,
          provider: model.provider,
          model: model.id,
          usage: buildUsage(0, 0),
          timestamp: Date.now(),
          errorMessage,
        };
        stream.push({
          type: "error",
          reason: "error",
          error: errorMessageBlock,
        });
      } finally {
        stream.end();
      }
    };

    queueMicrotask(() => void run());
    return stream;
  };
}

export default definePluginEntry({
  id: PROVIDER_ID,
  name: "HumanClaw",
  description: "Human-in-the-loop manual provider for OpenClaw",
  register(api) {
    api.registerProvider({
      id: PROVIDER_ID,
      label: "HumanClaw (manual)",
      docsPath: "/plugins/humanclaw",
      auth: [],
      augmentModelCatalog: () => [
        {
          id: MODEL_ID,
          name: "Manual (Human-in-the-loop)",
          provider: PROVIDER_ID,
          input: ["text"],
        },
      ],
      catalog: {
        order: "simple",
        run: async () => ({
          providers: {
            [PROVIDER_ID]: {
              api: "openai-completions",
              baseUrl: "http://localhost:0",
              apiKey: "MANUAL",
              models: [
                {
                  id: MODEL_ID,
                  label: "Manual (Human-in-the-loop)",
                },
              ],
            },
          },
        }),
      },
      wrapStreamFn: () => createManualStreamFn(),
    });
  },
});
