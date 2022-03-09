import { Sink } from "./Sink.ts";
import { ColorOptions, LoggingFormatter, LoggingLevel } from "../types.ts";
import { defaultColorOptions, textFormatter } from "./defaults.ts";

/**
 * A console sink that writes to the terminal using a set of colors.
 * Formatting is fully configurable but defaults to human readable text.
 */
export class ConsoleSink extends Sink {
  private _enableColors: boolean;
  private _colorOptions: ColorOptions;
  constructor(
    formatter?: LoggingFormatter,
    colorOpt?: Partial<ColorOptions>,
    levels?: LoggingLevel[],
  ) {
    super(formatter ?? textFormatter, levels ?? []);
    this._enableColors = true;
    this._colorOptions = Object.assign(defaultColorOptions, colorOpt);
  }

  public noColors(): ConsoleSink {
    this._enableColors = false;
    return this;
  }

  public log(message: string, level: LoggingLevel): void {
    if (!this.levels.includes(level)) return;
    if (!this._enableColors) {
      console.log(message);
      return;
    }
    const formatted = this.formatter({
      message,
      level,
      timestamp: new Date().toISOString(),
    });
    const colored = this._colorOptions[LoggingLevel[level].toLowerCase()](
      formatted,
    );
    switch (level) {
      case LoggingLevel.Log:
        console.log(colored);
        break;
      case LoggingLevel.Info:
        console.info(colored);
        break;
      case LoggingLevel.Debug:
        console.debug(colored);
        break;
      case LoggingLevel.Warning:
        console.warn(colored);
        break;
      case LoggingLevel.Error:
        console.error(colored);
        break;
      case LoggingLevel.Fatal:
        console.error(colored);
        break;
    }
  }
}
