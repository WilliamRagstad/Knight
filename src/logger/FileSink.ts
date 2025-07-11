import {
  LoggingLevel,
  MessageTemplateParams,
  TimestampProvider,
} from "../types.ts";
import { defaultTimestamp } from "./defaults.ts";
import { Sink } from "./Sink.ts";
import { ensureFileSync } from "@std/fs";
import { TextFormatter } from "./TextFormatter.ts";
import { Formatter } from "./Formatter.ts";
export class FileSink extends Sink {
  private _filepath: string;
  constructor(
    filepath: string,
    levels?: LoggingLevel[],
    formatter?: Formatter,
    timestampProvider?: TimestampProvider,
  ) {
    super(
      levels ?? [],
      formatter ?? new TextFormatter(),
      timestampProvider ?? defaultTimestamp,
    );
    this._filepath = filepath;
    ensureFileSync(filepath);
  }

  public log(
    level: LoggingLevel,
    template: string,
    params: MessageTemplateParams,
  ): void {
    if (!this.levels.includes(level)) return;
    if (this.formatter instanceof TextFormatter) {
      this.formatter.noColors();
    }
    const formatted = this.formatter.format({
      template: template,
      params: params,
      level: level,
      timestamp: this.timestampProvider(),
    });
    const encoder = new TextEncoder();
    Deno.writeFileSync(
      this._filepath,
      encoder.encode(formatted + "\n"),
      { create: true, append: true },
    );
  }
}
