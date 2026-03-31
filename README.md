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

## Install

### From npm (recommended)
```bash
openclaw plugins install humanclaw-plugin
openclaw plugins enable humanclaw
openclaw gateway restart
```

### From local source (development)
```bash
# Replace with your actual path
openclaw plugins install -l /path/to/humanclaw-openclaw-plugin
openclaw plugins enable humanclaw
openclaw gateway restart
```

## Usage

Once installed and enabled:

1. Select `humanclaw/manual` as your model in OpenClaw (in TUI or config)

2. In the **gateway terminal** (where you ran `openclaw gateway run`), you'll see:
   ```
   =====HumanClaw Manual Mode, Prompt: =====
   [The full prompt text from OpenClaw appears here]
   
   =====Please type or paste response here, end with <<<END>>> on a new line...
   ```

3. **Copy the prompt text** displayed above, paste it into any chatbot (ChatGPT, Claude, Gemini, etc.)

4. **Copy the chatbot's response**

5. **Return to the gateway terminal**, paste the response below the line, then type `<<<END>>>` on its own line and press Enter:
   ```
   [Your pasted response here]
   <<<END>>>
   ```

6. OpenClaw continues the workflow with your response

**Tip:** If the prompt is long, scroll up in the gateway terminal to see the full text.

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
