# HumanClaw

HumanClaw is a human-in-the-loop mode for agent workflows that lets users try their ideas without an API key to an LLM model. It makes prompts explicit, supports copy/paste into any chatbot, and allows users to estimate token usage and evaluate cost/benefit before enabling paid API accounts.

## Why HumanClaw
- No API key required to experiment, so one can start on OpenClaw faster.
- Zero accidental token burn
- Transparent prompts and responses, so one can understand how OpenClaw works better. 
- Human-in-the-loop evaluation before automation, try before you pay.

## Core Idea
HumanClaw runs in a default manual mode:
1. Show the full prompt to the user.
2. User pastes it into a chatbot.
3. User pastes the response back.
4. ManualClaw continues the workflow with the returned output.

## Token Usage Estimation
Since many chatbots do not expose exact token counts, HumanClaw estimates usage based on input and output length. These estimates are intended for rough cost/benefit evaluation, not billing.

## Compatibility Notes
- OpenClaw supports `/think <level>` for some GPT-5.2/Codex models. If that setting is passed as provider metadata (not prompt text), HumanClaw will not be able to honor it because Manual Mode does not make LLM API calls.

## Planned Features
- Manual mode as default
- Copy button for prompt payload
- Structured response input
- Token estimation summary (input, output, total)
- Session log for reviewing effectiveness and cost
- Manual Mode appears as a selectable model alongside LLM providers
- Dual-channel input (CLI + UI) with first-response-wins
- CLI fallback when UI is unavailable

## Interaction Options
Option A: CLI copy/paste workflow
- Print the full prompt in the console
- User pastes it into a chatbot
- User pastes the response back into the CLI
- End input with a sentinel like `<<<END>>>`

Option B: Local web UI
- CLI prints a local URL (e.g., `http://127.0.0.1:18790/manual`)
- Page shows a copy button and response textbox
- User submits response to continue the workflow

## Model Selection UX (Manual Mode)
- Manual Mode is listed as a model choice (like an LLM provider)
- If selected, both CLI and UI are available
- If UI fails to launch, continue in CLI mode automatically

## Status
Early concept. Repository scaffolding and contribution plan to be added.

## Contributing
Open to collaboration. Once the target upstream project is confirmed, this repo will include a contribution guide and development plan.
