import { LoggingFormatter, LoggingLevel } from "../types.ts";
import { defaultTimestamp, textFormatter } from "./defaults.ts";
import { Sink } from "./Sink.ts";
import { ensureFileSync } from "https://deno.land/std/fs/mod.ts";
export class FileSink extends Sink {
  private _filepath: string;
  constructor(
    filepath: string,
    formatter?: LoggingFormatter,
    levels?: LoggingLevel[],
  ) {
    super(formatter ?? textFormatter, levels ?? []);
    this._filepath = filepath;
    ensureFileSync(filepath);
  }

  // deno-lint-ignore no-explicit-any
  public log(data: any[], level: LoggingLevel): void {
    if (!this.levels.includes(level)) return;
    const formatted = this.formatter({
      data: data,
      level,
      timestamp: defaultTimestamp(),
      colorsEnabled: false,
    });
    const encoder = new TextEncoder();
    Deno.writeFileSync(
      this._filepath,
      encoder.encode(formatted + "\n"),
      { create: true, append: true },
    );
  }
}
