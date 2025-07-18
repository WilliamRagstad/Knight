// deno-lint-ignore-file no-explicit-any
import type { MessageTemplateParams } from "../types.ts";

/**
 * Extract an object with key names from the template string and values from the params.
 * @param template The template message string
 * @param params The values to replace in the template
 * @returns A properties object with matched names from the template and values from the params
 */
export function templateMessageParser(
  template: string,
  params: any[],
): MessageTemplateParams {
  const properties: MessageTemplateParams = {};
  let paramIndex = 0;
  for (let i = 0; i < template.length; i++) {
    const char = template.charAt(i);
    if (char === "{") {
      const key = template.substring(i + 1, template.indexOf("}", i));
      if (paramIndex >= params.length) {
        throw new Error(`Missing parameter for key: ${key}`);
      }
      properties[key] = params[paramIndex];
      paramIndex++;
      i += key.length - 1;
    }
  }
  return properties;
}

/**
 * @param template The template message string
 * @param params The values to replace in the template
 * @param paramFormatter A function to format the params before they are used in the template
 * @returns The formatted message
 */
export function compileMessage(
  template: string,
  params: MessageTemplateParams,
  paramFormatter: (d: any) => string,
): string {
  return template.replace(
    /\{([^}]+)\}/g,
    (_, key) => paramFormatter(params[key]),
  );
}
