# HumanClaw

HumanClaw is an OpenClaw provider plugin that inserts a **human-in-the-loop** step into the LLM call path. Instead of calling an LLM API, it prints the prompt, waits for you to paste the response, and resumes the agent workflow.

## Features (v0)
- Manual provider selectable like any other model
- CLI copy/paste workflow (no API key required)
- Rough token usage estimates (input/output length)

## How It Works
1. Select **HumanClaw (manual)** as your model/provider.
2. HumanClaw prints the full prompt.
3. Paste the prompt into any chatbot.
4. Paste the chatbot response back into the terminal.
5. End with the sentinel `<<<END>>>` to continue.

## Install (Local Dev)
From your plugin repo:

```bash
openclaw plugins install -l /Users/zhian/Projects/humanclaw-openclaw-plugin
openclaw plugins enable humanclaw
openclaw gateway restart
```

## Usage
Once the plugin is enabled, pick the model `humanclaw/manual` (or the UI label **HumanClaw (manual)**) and run any normal OpenClaw workflow. When the prompt appears, paste back your response and end with `<<<END>>>`.

## Notes
- Manual mode requires an interactive terminal.
- If your prompt is empty, HumanClaw will still accept a response.
- Token estimates are rough and for evaluation only.

## Status
Early prototype. Focused on validating provider‑plugin integration and the manual copy/paste loop.
