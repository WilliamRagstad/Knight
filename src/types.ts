// deno-lint-ignore-file no-explicit-any
import {
  HTTPMethods,
  Request,
  Response,
  RouteParams,
  RouterContext,
  RouterMiddleware,
} from "https://deno.land/x/oak/mod.ts";

import IController from "./IController.ts";

type Constructor<T> = new (...args: any[]) => T;

/**
 * Knights own router endpoint parameter type.
 * This is a custom type that extends the Oak `RouteParams` type.
 */
type Params = RouteParams<string>;

/**
 * Knights own router context type.
 * This is a custom type that extends the Oak `Context`.
 */
type Context = RouterContext<
  string,
  Params,
  Record<string | number, string | undefined>
>;

type StringRouterMiddleware = RouterMiddleware<
  string,
  Params,
  Record<string, any>
>;

/**
 * A type that represents Synchronous or Asynchronous void return types
 */
type Void = Promise<void> | void;

enum AppMode {
  DEV,
  PROD,
}

/**
 * The logging levels of a log message.
 */
enum LoggingLevel {
  Log,
  Debug,
  Info,
  Success,
  Warning,
  Error,
  Critical,
  Fatal,
}

/**
 * Format a string using the standard library `std/fmt/colors.ts` or custom function.
 */
type ColorFunction = (s: string) => string;

/**
 * Formatting functions for the `LoggingLevel` enum.
 */
type ColorOptions = {
  log: ColorFunction;
  debug: ColorFunction;
  info: ColorFunction;
  success: ColorFunction;
  warn: ColorFunction;
  error: ColorFunction;
  critical: ColorFunction;
  fatal: ColorFunction;
} & Record<string, ColorFunction>;

/**
 * A function that formats a log message.
 */
type LoggingFormatterData = {
  message: string;
  level: LoggingLevel;
  timestamp: string;
};

/**
 * A function that takes a message and returns a formatted string.
 */
type LoggingFormatter = (data: LoggingFormatterData) => string;

export { AppMode, IController, LoggingLevel, Request, Response };
export type {
  ColorFunction,
  ColorOptions,
  Constructor,
  Context,
  HTTPMethods,
  LoggingFormatter,
  Params,
  StringRouterMiddleware,
  Void,
};
