import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";

export default definePluginEntry({
  id: "humanclaw",
  name: "HumanClaw",
  description: "Human-in-the-loop manual provider for OpenClaw",
  register(api) {
    api.registerProvider({
      id: "humanclaw",
      label: "HumanClaw (manual)",
      docsPath: "/plugins/humanclaw",
      auth: [],
      catalog: {
        order: "simple",
        run: async () => ({
          providers: {
            humanclaw: {
              api: "openai-completions",
              baseUrl: "http://localhost:0",
              apiKey: "MANUAL",
              models: [
                {
                  id: "humanclaw/manual",
                  label: "Manual (Human-in-the-loop)",
                }
              ]
            }
          }
        })
      }
    });
  },
});
