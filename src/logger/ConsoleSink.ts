import { Sink } from "./Sink.ts";
import {
  LoggingLevel,
  type MessageTemplateParams,
  type TimestampProvider,
} from "../types.ts";
import { defaultTimestamp } from "./defaults.ts";
import { TextFormatter } from "./TextFormatter.ts";
import type { Formatter } from "./Formatter.ts";

/**
 * A console sink that writes to the terminal using a set of colors.
 * Formatting is fully configurable but defaults to human readable text.
 */
export class ConsoleSink extends Sink {
  constructor(
    levels?: LoggingLevel[],
    formatter?: Formatter,
    timestampProvider?: TimestampProvider,
  ) {
    super(
      levels ?? [],
      formatter ?? new TextFormatter(),
      timestampProvider ?? defaultTimestamp,
    );
  }

  public noColors(): ConsoleSink {
    if (this.formatter instanceof TextFormatter) {
      this.formatter.noColors();
    }
    return this;
  }

  public log(
    level: LoggingLevel,
    template: string,
    params: MessageTemplateParams,
  ): void {
    if (!this.levels.includes(level)) return;

    const formatted = this.formatter.format({
      template: template,
      params: params,
      level: level,
      timestamp: this.timestampProvider(),
    });
    switch (level) {
      case LoggingLevel.Log:
        console.log(formatted);
        break;
      case LoggingLevel.Debug:
        console.debug(formatted);
        break;
      case LoggingLevel.Info:
        console.info(formatted);
        break;
      case LoggingLevel.Success:
        console.log(formatted);
        break;
      case LoggingLevel.Warning:
        console.warn(formatted);
        break;
      case LoggingLevel.Error:
        console.error(formatted);
        break;
      case LoggingLevel.Critical:
        console.error(formatted);
        break;
      case LoggingLevel.Fatal:
        console.error(formatted);
        break;
      default:
        throw new Error("Unknown LoggingLevel " + level);
    }
  }
}
