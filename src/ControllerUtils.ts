import { Request, Response } from "https://deno.land/x/oak/mod.ts";
import { Constructor } from "./types.ts";

/*
88""Yb 888888  dP"Yb  88   88 888888 .dP"Y8 888888     88""Yb  dP"Yb  8888b.  Yb  dP     8b    d8    db    88""Yb 88""Yb 88 88b 88  dP""b8
88__dP 88__   dP   Yb 88   88 88__   `Ybo."   88       88__dP dP   Yb  8I  Yb  YbdP      88b  d88   dPYb   88__dP 88__dP 88 88Yb88 dP   `"
88"Yb  88""   Yb b dP Y8   8P 88""   o.`Y8b   88       88""Yb Yb   dP  8I  dY   8P       88YbdP88  dP__Yb  88"""  88"""  88 88 Y88 Yb  "88
88  Yb 888888  `"YoYo `YbodP' 888888 8bodP'   88       88oodP  YbodP  8888Y"   dP        88 YY 88 dP""""Yb 88     88     88 88  Y8  YboodP
*/

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
  const diff = difference(parsed, dtoType);
  if (!diff.matching) {
    throw new Error(
      "Invalid request body, expected " + dtoType.name + " DTO." +
        (diff.missing.length > 0
          ? ` Missing fields: ${diff.missing.join(", ")}.`
          : "") +
        (diff.invalid.length > 0
          ? ` Invalid fields: ${diff.invalid.join(", ")}.`
          : ""),
    );
  }
  return parsed as TModel;
}

// deno-lint-ignore no-explicit-any
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

/*
	88""Yb 888888 .dP"Y8 88""Yb  dP"Yb  88b 88 .dP"Y8 888888     88  88 888888 88     88""Yb 888888 88""Yb     888888 88   88 88b 88  dP""b8 888888 88  dP"Yb  88b 88 .dP"Y8
	88__dP 88__   `Ybo." 88__dP dP   Yb 88Yb88 `Ybo." 88__       88  88 88__   88     88__dP 88__   88__dP     88__   88   88 88Yb88 dP   `"   88   88 dP   Yb 88Yb88 `Ybo."
	88"Yb  88""   o.`Y8b 88"""  Yb   dP 88 Y88 o.`Y8b 88""       888888 88""   88  .o 88"""  88""   88"Yb      88""   Y8   8P 88 Y88 Yb        88   88 Yb   dP 88 Y88 o.`Y8b
	88  Yb 888888 8bodP' 88      YbodP  88  Y8 8bodP' 888888     88  88 888888 88ood8 88     888888 88  Yb     88     `YbodP' 88  Y8  YboodP   88   88  YbodP  88  Y8 8bodP'
*/

/**
 * Send an HTTP response with a status code of 200 (OK) and the given body.
 * @param response The response object to use
 * @param body The body to send back
 */
// deno-lint-ignore no-explicit-any
export function ok(
  response: Response,
  body: string | Record<string, any>,
): void {
  response.status = 200;
  response.body = body;
}

/**
 * Send an HTTP response with a status code of 201 (Created) and the given body.
 * @param response The response object to use
 * @param body The body to send back
 */
// deno-lint-ignore no-explicit-any
export function created(
  response: Response,
  body: string | Record<string, any>,
): void {
  response.status = 201;
  response.body = body;
}
