// deno-lint-ignore-file no-explicit-any
import { Sink } from "./Sink.ts";
import { LoggingLevel } from "../types.ts";
import { templateMessageParser } from "./parser.ts";

export class Logger {
  private _sinks: Sink[];

  constructor(...sinks: Sink[]) {
    this._sinks = sinks;
  }

  public attach(sink: Sink): Logger {
    this._sinks.push(sink);
    return this;
  }

  private _log(level: LoggingLevel, template: string, params: any[]): void {
    this._sinks.forEach((sink) =>
      sink.log(level, template, templateMessageParser(template, params))
    );
  }

  /**
   * Logs a message at the lowest `Log` level.
   * @param data Values to log.
   */
  public log(message: string, ...params: any[]): void {
    this._log(LoggingLevel.Log, message, params);
  }

  /**
   * Logs a message at the `Debug` level.
   * @param data Values to log.
   */
  public debug(message: string, ...params: any[]): void {
    this._log(LoggingLevel.Debug, message, params);
  }

  /**
   * Logs a message at the `Info` level.
   * @param data Values to log.
   */
  public info(message: string, ...params: any[]): void {
    this._log(LoggingLevel.Info, message, params);
  }

  /**
   * Logs a message at the `Debug` level.
   * @param data Values to log.
   */
  public success(message: string, ...params: any[]): void {
    this._log(LoggingLevel.Success, message, params);
  }

  /**
   * Logs a message at the `Warning` level.
   * @param data Values to log.
   */
  public warning(message: string, ...params: any[]): void {
    this._log(LoggingLevel.Warning, message, params);
  }

  /**
   * Logs a message at the `Error` level.
   * @param data Values to log.
   */
  public error(message: string, ...params: any[]): void {
    this._log(LoggingLevel.Error, message, params);
  }

  /**
   * Logs a message at the `Critical` level.
   * @param data Values to log.
   */
  public critical(message: string, ...params: any[]): void {
    this._log(LoggingLevel.Critical, message, params);
  }

  /**
   * Logs a message at the `Fatal` level.
   * @param data Values to log.
   */
  public fatal(message: string, ...params: any[]): void {
    this._log(LoggingLevel.Fatal, message, params);
  }
}
