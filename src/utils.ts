
import { Constructor, Request, Response } from "./types.ts";


/**========================================================================
 *                           Request helpers
 *========================================================================**/

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

function difference<TModel>(
	// deno-lint-ignore no-explicit-any
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

/**========================================================================
 *                           Response Helpers
 *========================================================================**/

/**
 * Send an HTTP response with a status code of 200 (OK) and the given body.
 * @param response The response object to use
 * @param body The body to send back
 */
export function ok(
	response: Response,
	// deno-lint-ignore no-explicit-any
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
export function created(
	response: Response,
	// deno-lint-ignore no-explicit-any
	body: string | Record<string, any>,
): void {
	response.status = 201;
	response.body = body;
}