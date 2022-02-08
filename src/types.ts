// deno-lint-ignore-file no-explicit-any
import {
  RouteParams,
  RouterContext,
  RouterMiddleware,
  State,
} from "https://deno.land/x/oak/mod.ts";

export type Constructor<T> = new (...args: any[]) => T;

export type Params = RouteParams<string>;

export type StringRouterMiddleware = RouterMiddleware<
  string,
  Params,
  Record<string, any>
>;
export type StringRouterContext = RouterContext<
  string,
  Params,
  Record<string, any>
>;

export type UnknownReturn = Promise<unknown> | unknown | Promise<void> | void;

export type StringEndpoint = (
  params: Params,
  ctx: RouterContext<string, Params, Record<string, any>>,
) => UnknownReturn;
