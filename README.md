# HumanClaw

HumanClaw is an OpenClaw provider plugin that inserts a **human-in-the-loop** step into the LLM call path. Instead of calling an LLM API, it prints the prompt, waits for you to paste the response, and resumes the agent workflow.

## Features (v0.1.0)
- Manual provider selectable like any other model
- CLI copy/paste workflow (no API key required)
- 2-minute timeout with deadline display
- Rough token usage estimates (input/output length)
- Debug logging support (`HUMANCLAW_DEBUG=true`)

## How It Works
1. Select **HumanClaw (manual)** as your model/provider.
2. HumanClaw prints the full prompt with a deadline (2 minutes).
3. Paste the prompt into any chatbot.
4. Paste the chatbot response back into the terminal.
5. End with the sentinel `<<<END>>>` on its own line to continue.

## Install (Local Dev)
From your plugin repo:

```bash
# Replace with your actual path
openclaw plugins install -l /path/to/humanclaw-openclaw-plugin
openclaw plugins enable humanclaw
openclaw gateway restart
```

## Usage
Once the plugin is enabled, pick the model `humanclaw/manual` (or the UI label **HumanClaw (manual)**) and run any normal OpenClaw workflow. When the prompt appears, paste back your response and end with `<<<END>>>`.

## Configuration

### Timeout
The console input has a 2-minute timeout. If you don't respond in time, HumanClaw will reject and OpenClaw may retry or use a fallback model.

### Debug Logging
To enable verbose logging for troubleshooting:

```bash
HUMANCLAW_DEBUG=true openclaw gateway run
```

This logs:
- When `getResponse` is called
- Raw data received from stdin
- When stream push occurs

## Notes
- Manual mode requires an interactive terminal (`stdin.isTTY` must be true).
- If your prompt is empty, HumanClaw will still accept a response.
- Token estimates are rough and for evaluation only.
- The retry response issue is a known upstream OpenClaw limitation (stream consumption on retry).

## Status
Early prototype. Focused on validating provider‑plugin integration and the manual copy/paste loop.

## Known Issues
- After a timeout, OpenClaw's retry may not display the response in TUI (upstream issue). The response is received and stored, but UI update may be delayed until reconnect.
