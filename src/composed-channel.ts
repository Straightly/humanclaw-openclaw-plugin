import type { InputChannel } from "./types.js";

/**
 * ComposedInputChannel - aggregates multiple input channels in parallel
 * Whichever channel responds first wins
 */
export class ComposedInputChannel implements InputChannel {
  private channels: InputChannel[];
  private _name: string;

  get name(): string {
    return this._name;
  }

  constructor(channels: InputChannel[]) {
    this.channels = channels;
    this._name = `composed(${channels.map((c) => c.name).join(",")})`;
  }

  async getResponse(promptText: string, abortSignal?: AbortSignal): Promise<string> {
    if (this.channels.length === 0) {
      throw new Error("No input channels configured");
    }

    if (this.channels.length === 1) {
      return this.channels[0].getResponse(promptText, abortSignal);
    }

    // Race between all channels
    const promises = this.channels.map((channel) =>
      channel.getResponse(promptText, abortSignal)
    );

    return Promise.race(promises);
  }

  /**
   * Add a channel to the composition
   */
  addChannel(channel: InputChannel): void {
    this.channels.push(channel);
    this._name = `composed(${this.channels.map((c) => c.name).join(",")})`;
  }

  /**
   * Get all configured channels
   */
  getChannels(): readonly InputChannel[] {
    return this.channels;
  }
}
