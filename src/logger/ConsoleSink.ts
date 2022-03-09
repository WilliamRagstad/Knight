import { Sink } from "./Sink.ts";
import { ColorOptions, LoggingFormatter, LoggingLevel } from "../types.ts";
import {
  defaultColorOptions,
  defaultTimestamp,
  textFormatter,
} from "./defaults.ts";

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

  // deno-lint-ignore no-explicit-any
  public log(data: any[], level: LoggingLevel): void {
    if (!this.levels.includes(level)) return;
    const colorFunction = this._colorOptions[LoggingLevel[level].toLowerCase()];
    const formatted = this.formatter({
      data: data,
      level: level,
      timestamp: defaultTimestamp(),
      levelColorFunction: colorFunction,
      colorsEnabled: this._enableColors,
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
