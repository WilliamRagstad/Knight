import { Formatter, LoggingFormatterData } from "./Formatter.ts";
import { compileMessage } from "./parser.ts";

export class JSONFormatter extends Formatter {
  /**
   * Format a message as JSON of the form `{"message": MESSAGE, "template": TEMPLATE_STRING, "params", PARAMS, "level": LEVEL, "timestamp": TIME}`.
   * Colors are not supported.
   * @param data The data to format
   * @returns The formatted data as JSON
   */
  public format(
    { template, params, level, timestamp }: LoggingFormatterData,
  ): string {
    return JSON.stringify({
      message: compileMessage(template, params, JSON.stringify),
      template,
      params,
      level,
      timestamp,
    });
  }
}
