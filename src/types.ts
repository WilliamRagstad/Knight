// deno-lint-ignore-file no-explicit-any
import {
	Application,
	Router,
	RouteParams,
	RouterContext,
	RouterMiddleware,
	Request,
	Response,
	Context,
	HTTPMethods,
	State
} from "https://deno.land/x/oak/mod.ts";
import IController from "./IController.ts";

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


export enum AppMode {
	DEV,
	PROD,
}

export {
	IController,
	Application,
	Router, Request,
	Response,
	Context
};
export type {
	HTTPMethods,
	State,
	RouterContext,
	RouteParams,
	RouterMiddleware
};
