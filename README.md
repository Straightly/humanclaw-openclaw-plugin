# HumanClaw

HumanClaw is an OpenClaw plugin that lets you try OpenClaw **without an API key**. It shows you the prompts, you copy them into any free chatbot (like ChatGPT, Claude, or Gemini), paste the response back, and OpenClaw continues working.

**Perfect for:**
- Trying OpenClaw before paying for API access
- Learning how OpenClaw works by seeing the actual prompts
- Saving money by using free chatbots instead of paid APIs

## What You Need First

1. **OpenClaw installed** - See [OpenClaw docs](https://docs.openclaw.ai) for installation
2. **Gateway running** - Run `openclaw gateway run` in a terminal and keep it open
3. **TUI or other interface** - Run `openclaw tui` in another terminal to chat

**No API key needed for this plugin!**

## Quick Start

```bash
# Install the plugin
openclaw plugins install humanclaw-plugin

# Enable it
openclaw plugins enable humanclaw

# Restart gateway
openclaw gateway restart

# Now in TUI, select the model
/model humanclaw/manual

# Start chatting - prompts will appear in the gateway terminal
```

## How It Works

```
┌─────────────┐     ┌─────────────┐     ┌─────────────────┐
│  OpenClaw   │────▶│  HumanClaw  │────▶│ Gateway Terminal│
│   TUI       │     │   Plugin    │     │ (shows prompt)  │
└─────────────┘     └─────────────┘     └─────────────────┘
                                               │
                                               ▼
                                        ┌─────────────────┐
                                        │ Copy prompt to  │
                                        │ free chatbot    │
                                        │ (ChatGPT, etc)  │
                                        └─────────────────┘
                                               │
                                               ▼
                                        ┌─────────────────┐
                                        │ Paste response  │
                                        │ back to gateway │
                                        │ + type END      │
                                        └─────────────────┘
```

## Detailed Steps

### Step 1: Install and Enable

Run these commands in your terminal:

```bash
openclaw plugins install humanclaw-plugin
openclaw plugins enable humanclaw
openclaw gateway restart
```

### Step 2: Select HumanClaw as Your Model

**Option A: In TUI (easiest)**
1. Run `openclaw tui`
2. Type: `/model humanclaw/manual`
3. Press Enter

**Option B: In config file**
Add to your OpenClaw config:
```json
{
  "defaultModel": "humanclaw/manual"
}
```

### Step 3: Send a Message

1. In TUI, type any message and press Enter
2. Look at the **gateway terminal** (where you ran `openclaw gateway run`)
3. You'll see something like:
   ```
   =====HumanClaw Manual Mode, Prompt: =====
   [system]
   You are a helpful assistant...
   
   [user]
   Hello, how are you?
   
   =====Please type or paste response here, end with <<<END>>>...
   Waiting until 08:45 PM...
   ```

### Step 4: Copy to Free Chatbot

1. **Select and copy** the prompt text (from `[system]` to `[user]`)
2. Open any free chatbot in your browser:
   - [ChatGPT](https://chat.openai.com) (free tier available)
   - [Claude](https://claude.ai) (free tier available)
   - [Gemini](https://gemini.google.com) (free)
   - Or any other chatbot you have access to
3. **Paste** the prompt into the chatbot
4. **Copy** the chatbot's response

### Step 5: Paste Response Back

1. Go back to the **gateway terminal**
2. **Paste** the response under the line
3. Type `<<<END>>>` on its own line
4. Press Enter

Example:
```
I'm doing well, thank you for asking! How can I help you today?
<<<END>>>
```

### Step 6: See Result in TUI

OpenClaw will continue and you'll see the response in your TUI!

## Common Issues

### "HumanClaw input timed out after 120 seconds"
You took too long. Just send another message in TUI and try again.

### "HumanClaw console input requires an interactive terminal"
Make sure you're running `openclaw gateway run` in a real terminal (not in background or script).

### Prompt is cut off / can't see full text
Scroll UP in the gateway terminal. The prompt might be long.

### Response not showing in TUI after timeout
This is a known OpenClaw issue. Restart TUI or send a new message.

### Can't select text in terminal
Try:
- **macOS:** Cmd+Shift+C to copy in Terminal.app
- **Linux:** Ctrl+Shift+C in most terminals
- **Windows:** Right-click to copy in PowerShell

## Configuration

### Timeout
You have 2 minutes to respond. The deadline is shown (e.g., "Waiting until 08:45 PM...").

### Debug Mode
If something isn't working, run with debug logging:

```bash
HUMANCLAW_DEBUG=true openclaw gateway run
```

This will show extra information about what's happening.

## Features

- **No API key required** - Use free chatbots instead
- **2-minute timeout** - Clear deadline displayed
- **Works with any chatbot** - ChatGPT, Claude, Gemini, local models, etc.
- **See the prompts** - Learn how OpenClaw constructs prompts
- **Token estimation** - Rough cost estimates for comparison

## Limitations

- Requires keeping two terminals open (gateway + TUI)
- Copy/paste workflow (not automatic)
- 2-minute time limit per response
- After timeout, retry may not display immediately in TUI (upstream OpenClaw issue)

## Support

- **GitHub Issues:** https://github.com/Straightly/humanclaw-openclaw-plugin/issues
- **OpenClaw Discord:** Ask in #plugin-forum

## License

MIT - Free to use and modify.

---

**Happy hacking without API keys! 🎉**
