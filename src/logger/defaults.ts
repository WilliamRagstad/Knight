import {
  ColorFunction,
  ColorOptions,
  LoggingFormatter,
  LoggingLevel,
} from "../types.ts";
import {
  bold,
  cyan,
  gray,
  green,
  red,
  rgb24,
  white,
  yellow,
} from "https://deno.land/std@0.128.0/fmt/colors.ts";

/**
 * Default color options for the `ConsoleSink` class.
 */
export const defaultColorOptions: ColorOptions = {
  log: white,
  info: cyan,
  success: green,
  debug: gray,
  warn: yellow,
  error: red,
  critical: (s) => rgb24(s, { r: 255, g: 165, b: 0 }),
  fatal: red,
};

/**
 * An identity function that returns the input string.
 * @param s Any input string
 * @returns The input string
 */
export const identityColorFunction: ColorFunction = (s) => s;

/**
 * The current timestamp in the international ISO standard for specifying dates.
 * @returns The current timestamp
 */
export const isoTimestamp = (): string => new Date().toISOString();

/**
 *
 * @returns
 */
export const defaultTimestamp = (): string => {
	const full = isoTimestamp();
	const date = full.substring(0, full.indexOf("T"));
	const time = full.substring(full.indexOf("T") + 1, full.indexOf("."));
	return `${date} ${time}`;
}

/**
 * Format a message as human readable text of the form `TIME [LEVEL] MESSAGE`.
 * @param data The data to format
 * @returns The formatted data as text
 */
export const textFormatter: LoggingFormatter = (
  { message, level, timestamp },
) => `${timestamp} [${level}] ${message}`;

/**
 * Format a message as JSON of the form `{"message": MESSAGE, "level": LEVEL, "time": TIME}`.
 * @param data The data to format
 * @returns The formatted data as JSON
 */
export const jsonFormatter: LoggingFormatter = (
  { message, level, timestamp },
) => JSON.stringify({ message, level, timestamp });
