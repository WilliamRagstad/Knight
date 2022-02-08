// deno-lint-ignore-file no-explicit-any
import {
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
type Void = Promise<unknown> | Promise<void> | void;

enum AppMode {
  DEV,
  PROD,
}

export { AppMode, IController, Request, Response };
export type { Constructor, Context, Params, StringRouterMiddleware, Void };
