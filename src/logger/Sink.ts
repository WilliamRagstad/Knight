import { LoggingFormatter, LoggingLevel } from "../types.ts";

/**
 * Sink is a class that can be attached to a `Logger` instance.
 * It is responsible for the actual implementation of logging to a specific destination,
 * such as the console, or a file.
 */
export abstract class Sink {
  /**
   * Format function to be used when logging messages.
   */
  public formatter: LoggingFormatter;
  /**
   * The specific logging levels to log to the sink.
   */
  public levels: LoggingLevel[];

  /**
   * Construct a new sink.
   * @param levels The specific logging levels to log to the sink. Defaults to all levels.
   */
  constructor(formatter: LoggingFormatter, levels: LoggingLevel[]) {
    this.formatter = formatter;
    this.levels = levels;
    if (levels.length === 0) {
      this.fromRange(LoggingLevel.Log);
    }
  }

  /**
   * Log messages at the specified logging level.
   * @param minLevel The minimum logging level to log to the sink.
   * @param maxLevel The maximum logging level to log to the sink.
   */
  public fromRange(
    minLevel: LoggingLevel,
    maxLevel?: LoggingLevel,
  ) {
    // If no max level is specified, default to the max level.
    if (!maxLevel) {
      maxLevel = LoggingLevel.Fatal;
    }

    // Create an array of all the levels between the min and max level.
    this.levels = [];
    for (let i = minLevel; i <= maxLevel; i++) {
      this.levels.push(i as LoggingLevel);
    }
    return this;
  }

  /**
   * Logs the given message to the sink.
   * @param message The message to log.
   */
  // deno-lint-ignore no-explicit-any
  public abstract log(data: any[], level: LoggingLevel): void;
}
