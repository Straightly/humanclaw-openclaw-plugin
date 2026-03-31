/**
 * InputChannel interface - defines how a channel provides human input
 * This mirrors the StreamFn pattern from OpenClaw plugins
 */
export interface InputChannel {
  readonly name: string;

  /**
   * Display the prompt to the user and wait for response
   * @param promptText - the formatted prompt to display
   * @param abortSignal - optional abort signal to cancel the operation
   * @returns Promise that resolves with the user's response
   */
  getResponse(promptText: string, abortSignal?: AbortSignal): Promise<string>;
}

/**
 * Model information passed through the stream
 */
export interface ModelInfo {
  api: string;
  provider: string;
  id: string;
}
