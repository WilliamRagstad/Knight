import { ColorOptions, LoggingFormatter } from "../types.ts";
import {
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
