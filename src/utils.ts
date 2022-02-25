// deno-lint-ignore-file no-explicit-any
import { Constructor, Request, Response } from "./types.ts";

/** ========================================================================
 *                           Request helpers
 * ========================================================================* */

export async function bodyText(request: Request): Promise<string> {
  return await request.body({ type: "text" }).value;
}

export async function bodyBytes(request: Request): Promise<Uint8Array> {
  return await request.body({ type: "bytes" }).value;
}

export async function bodyStream(
  request: Request,
): Promise<ReadableStream<Uint8Array>> {
  return await request.body({ type: "stream" }).value;
}

export async function bodyAny(request: Request): Promise<any> {
  return await request.body({ type: "undefined" }).value;
}

/**
 * Extracts the body of a request as JSON and maps it to the given class.
 * @param request The request object to parse the body from
 * @param dtoType The type of the DTO to map the body to
 * @throws Error if the request body is not of the expected type (JSON) OR if the body cannot be mapped to the given DTO type
 * @returns The mapped DTO
 */
export async function bodyMappingJSON<TModel>(
  request: Request,
  dtoType: Constructor<TModel>,
): Promise<TModel> {
  const parsed = await request.body({ type: "json" }).value;
  return mapping(parsed, dtoType);
}
export async function bodyMappingForm<TModel>(
  request: Request,
  dtoType: Constructor<TModel>,
): Promise<TModel> {
  const parsed = await request.body({ type: "form" }).value;
  return mapping(paramsToObject(parsed), dtoType);
}
export async function bodyMappingFormData<TModel>(
  request: Request,
  dtoType: Constructor<TModel>,
): Promise<TModel> {
  const parsed = await request.body({ type: "form-data" }).value.read();
  return mapping(parsed.fields, dtoType);
}
function paramsToObject(entries: URLSearchParams) {
  const result: Record<string, any> = {};
  for (const [key, value] of entries) {
    result[key] = value;
  }
  return result;
}

function mapping<T>(data: Record<string, any>, type: Constructor<T>): T {
  const diff = difference(data, type);
  if (!diff.matching) {
    throw new Error(
      "Invalid request body, expected " + type.name + " DTO." +
        (diff.missing.length > 0
          ? ` Missing fields: ${diff.missing.join(", ")}.`
          : "") +
        (diff.invalid.length > 0
          ? ` Invalid fields: ${diff.invalid.join(", ")}.`
          : ""),
    );
  }
  return data as T;
}

function difference<TModel>(
  json: Record<string, any>,
  dtoType: Constructor<TModel>,
): { matching: boolean; missing: string[]; invalid: string[] } {
  const jsonKeys = Object.keys(json);
  const dtoFields = classFields(dtoType);
  const missing = dtoFields.filter((field) =>
    !jsonKeys.includes(field.name) && !field.optional
  ).map((field) => field.name);
  const invalid = jsonKeys.filter((key) =>
    !dtoFields.find((field) => field.name === key)
  );
  return {
    matching: missing.length === 0 && invalid.length === 0,
    missing,
    invalid,
  };
}

function classFields<T>(
  classType: Constructor<T>,
): { name: string; optional: boolean }[] {
  const t = classType.toString();
  const optionals: string[] = classType.prototype.optionals ?? [];
  const fields = t.substring(t.indexOf("{") + 1, t.indexOf("constructor"))
    .split(";").map((s) => s.trim()).filter((s) => s.length > 0).map((f) => ({
      name: f,
      optional: optionals.includes(f),
    }));
  return fields;
}

/** ========================================================================
 *                           Response Helpers
 * ========================================================================* */

/**
 * Send an HTTP response with a status code of 200 (OK) and the given body.
 * @param response The response object to use
 * @param body The body to send back
 */
export function ok(
  response: Response,
  body: any,
): void {
  response.status = 200;
  response.body = body;
}

/**
 * Send an HTTP response with a status code of 201 (Created) and the given body.
 * Preferably return the created resource URI.
 * @param response The response object to use
 * @param body The body to send back
 */
export function created(
  response: Response,
  body: any,
): void {
  response.status = 201;
  response.body = body;
}

/**
 * Send an HTTP response with a status code of 202 (Accepted).
 * @param response The response object to use
 */
export function accepted(response: Response): void {
  response.status = 202;
}

/**
 * Send an HTTP response with a status code of 204 (No Content).
 * @param response The response object to use
 */
export function noContent(response: Response): void {
  response.status = 204;
}

/**
 * Redirect the client to the given permanent location URL with a status code of 301 (Moved Permanently).
 * This and all future requests should be directed to the given URI. (Cached in the browser)
 * @param response The response object to use
 * @param location The location to send back
 */
export function redirect(response: Response, location: string): void {
  response.status = 301;
  response.headers.set("Location", location);
}

/**
 * Redirect the client to the given temporary location URL with a status code of 302 (Found).
 * The request method is changed to GET for the next request.
 * @param response The response object to use
 * @param location The location to send back
 */
export function found(response: Response, location: string): void {
  response.status = 302;
  response.headers.set("Location", location);
}

/**
 * Redirect the client to the given temporary location URL with a status code of 307 (Temporary Redirect).
 * The request method is not allowed to be changed when reissuing the original request.
 * @param response The response object to use
 * @param location The location to send back
 */
export function redirectTemp(response: Response, location: string): void {
  response.status = 307;
  response.headers.set("Location", location);
}

/**
 * The resource requested has been definitively moved to the location URL.
 * A browser redirects to this page and search engines update their links to the resource.
 * @param response The response object to use
 * @param location The location to send back
 */
export function redirectPerm(response: Response, location: string): void {
  response.status = 308;
  response.headers.set("Location", location);
}

/**
 * Send an HTTP response with a status code of 404 (Not Found).
 * @param response The response object to use
 */
export function notFound(response: Response): void {
  response.status = 404;
}

/**
 * Send an HTTP response with a status code of 400 (Bad Request).
 * @param response The response object to use
 * @param message The message to send back
 */
export function badRequest(response: Response, message: string): void {
  response.status = 400;
  response.body = message;
}

/**
 * Send an HTTP response with a status code of 401 (Unauthorized).
 * @param response The response object to use
 */
export function unauthorized(response: Response): void {
  response.status = 401;
}

/**
 * Send an HTTP response with a status code of 406 (Not Acceptable).
 * @param response The response object to use
 */
export function notAcceptable(response: Response): void {
  response.status = 406;
}
/**
 * I'm a teapot.
 * @param response The response object to use
 */
export function im_a_teapot(response: Response): void {
  response.status = 418;
}

/**
 * Send an HTTP response with a status code of 500 (Internal Server Error).
 * @param response The response object to use
 */
export function internalServerError(response: Response): void {
  response.status = 500;
}

/**
 * Send an HTTP response with a status code of 501 (Not Implemented).
 * @param response The response object to use
 */
export function notImplemented(response: Response): void {
  response.status = 501;
}

/**
 * Send an HTTP response with a status code of 502 (Bad Gateway).
 * @param response The response object to use
 */
export function badGateway(response: Response): void {
  response.status = 502;
}

/**
 * Send an HTTP response with a status code of 503 (Service Unavailable).
 * @param response The response object to use
 */
export function serviceUnavailable(response: Response): void {
  response.status = 503;
}
