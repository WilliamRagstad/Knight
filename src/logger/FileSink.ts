import { LoggingFormatter, LoggingLevel } from "../types.ts";
import { textFormatter } from "./defaults.ts";
import { Sink } from "./Sink.ts";
export class FileSink extends Sink {
  private _filepath: string;
  constructor(
    filepath: string,
    formatter?: LoggingFormatter,
    levels?: LoggingLevel[],
  ) {
    super(formatter ?? textFormatter, levels ?? []);
    this._filepath = filepath;
  }

  public log(message: string, level: LoggingLevel): void {
    if (!this.levels.includes(level)) return;
    const formatted = this.formatter({
      message,
      level,
      timestamp: new Date().toISOString(),
    });
    const encoder = new TextEncoder();
    Deno.writeFileSync(
      this._filepath,
      encoder.encode(formatted + "\n"),
      { create: true, append: true },
    );
  }
}
