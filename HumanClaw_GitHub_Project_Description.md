# HumanClaw — OpenClaw Manual-Mode Provider Plugin

HumanClaw is an OpenClaw provider plugin that inserts a **human-in-the-loop** step into the LLM call path. Instead of sending prompts directly to an API, HumanClaw presents the prompt to the user for manual copy/paste into any chatbot, then accepts the response and resumes the agent workflow.

## Why HumanClaw
- Try OpenClaw workflows without an API key
- Avoid accidental token spend
- Make prompts transparent and user-controlled
- Evaluate effectiveness and cost/benefit before enabling paid APIs

## How It Works (High Level)
1. User selects **HumanClaw** as the model/provider.
2. OpenClaw emits the full prompt.
3. User copies the prompt into any chatbot.
4. User pastes the chatbot response back into OpenClaw.
5. OpenClaw continues the workflow with the manual response.

## Planned UX
- CLI copy/paste flow with a clear sentinel to finish input
- Optional local web UI for easier copy/paste
- Dual-channel input (UI + CLI), first-response-wins
- CLI fallback if UI is unavailable
- Estimated token usage based on input/output length

## Status
Early concept. Initial focus is on validating the provider-plugin approach and OpenClaw integration points.
