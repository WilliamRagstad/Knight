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

  private _log(data: any[], level: LoggingLevel): void {
    this._sinks.forEach((sink) => sink.log(data, level));
  }

  /**
   * Logs a message at the lowest `Log` level.
   * @param data Values to log.
   */
  public log(...data: any[]): void {
    this._log(data, LoggingLevel.Log);
  }

  /**
   * Logs a message at the `Debug` level.
   * @param data Values to log.
   */
  public debug(...data: any[]): void {
    this._log(data, LoggingLevel.Debug);
  }

  /**
   * Logs a message at the `Info` level.
   * @param data Values to log.
   */
  public info(...data: any[]): void {
    this._log(data, LoggingLevel.Info);
  }

  /**
   * Logs a message at the `Debug` level.
   * @param data Values to log.
   */
  public success(...data: any[]): void {
    this._log(data, LoggingLevel.Success);
  }

  /**
   * Logs a message at the `Warning` level.
   * @param data Values to log.
   */
  public warn(...data: any[]): void {
    this._log(data, LoggingLevel.Warning);
  }

  /**
   * Logs a message at the `Error` level.
   * @param data Values to log.
   */
  public error(...data: any[]): void {
    this._log(data, LoggingLevel.Error);
  }

  /**
   * Logs a message at the `Critical` level.
   * @param data Values to log.
   */
  public critical(...data: any[]): void {
    this._log(data, LoggingLevel.Critical);
  }

  /**
   * Logs a message at the `Fatal` level.
   * @param data Values to log.
   */
  public fatal(...data: any[]): void {
    this._log(data, LoggingLevel.Fatal);
  }
}
