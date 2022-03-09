// deno-lint-ignore-file no-explicit-any
import { Sink } from "./Sink.ts";
import { LoggingLevel } from "../types.ts";

export class Logger {
  private _sinks: Sink[];

  constructor(...sinks: Sink[]) {
    this._sinks = sinks;
  }

  public attach(sink: Sink): Logger {
    this._sinks.push(sink);
    return this;
  }

  private _log(args: any[], level: LoggingLevel): void {
    this._sinks.forEach((sink) => sink.log(args.join(" "), level));
  }

  /**
   * Logs a message at the lowest `Log` level.
   * @param args Values to log.
   */
  public log(...args: any[]): void {
    this._log(args, LoggingLevel.Log);
  }

  /**
   * Logs a message at the `Info` level.
   * @param args Values to log.
   */
  public info(...args: any[]): void {
    this._log(args, LoggingLevel.Info);
  }

  /**
   * Logs a message at the `Debug` level.
   * @param args Values to log.
   */
  public debug(...args: any[]): void {
    this._log(args, LoggingLevel.Debug);
  }

  /**
   * Logs a message at the `Warning` level.
   * @param args Values to log.
   */
  public warn(...args: any[]): void {
    this._log(args, LoggingLevel.Warning);
  }

  /**
   * Logs a message at the `Error` level.
   * @param args Values to log.
   */
  public error(...args: any[]): void {
    this._log(args, LoggingLevel.Error);
  }

  /**
   * Logs a message at the `Critical` level.
   * @param args Values to log.
   */
  public critical(...args: any[]): void {
    this._log(args, LoggingLevel.Critical);
  }

  /**
   * Logs a message at the `Fatal` level.
   * @param args Values to log.
   */
  public fatal(...args: any[]): void {
    this._log(args, LoggingLevel.Fatal);
  }
}
