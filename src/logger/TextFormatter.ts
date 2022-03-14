import { bold, gray } from "https://deno.land/std@0.128.0/fmt/colors.ts";
import { LoggingLevel } from "../types.ts";
import {
  defaultLevelColorOptions,
  defaultParamColorOptions,
  defaultTimestampColorOption,
} from "./defaults.ts";
import { Formatter, LoggingFormatterData } from "./Formatter.ts";
import { compileMessage } from "./parser.ts";

function spacingUntil(current: number, length: number): string {
  return " ".repeat(length - current);
}

const identityColorFunction: ColorFunction = (s: any) => s;

/**
 * Format a string using the standard library `std/fmt/colors.ts` or custom function.
 */
type ColorFunction = (str: string) => string;

export type LevelColors = {
  log: ColorFunction;
  debug: ColorFunction;
  info: ColorFunction;
  success: ColorFunction;
  warning: ColorFunction;
  error: ColorFunction;
  critical: ColorFunction;
  fatal: ColorFunction;
};

/**
 * Coloring for interpolated strings parameters.
 */
export type ParamColors = {
  string: ColorFunction;
  number: ColorFunction;
  integer: ColorFunction;
  bigint: ColorFunction;
  boolean: ColorFunction;
  undefined: ColorFunction;
  null: ColorFunction;
  function: ColorFunction;
  symbol: ColorFunction;
  object: (o: Record<string, any>) => string;
  array: (a: any[]) => string;
  date: ColorFunction;
  exception: ColorFunction;
};

/**
 * Options for the `TextFormatter` class.
 */
export type TextFormatterOptions = {
  colorsEnabled: boolean;
  align: boolean;
  levels: LevelColors;
  params: ParamColors;
  timestamp: ColorFunction;
};

/**
 * Default console logging formatter.
 */
export class TextFormatter extends Formatter {
  public options: TextFormatterOptions;
  constructor(options?: Partial<TextFormatterOptions>) {
    super();
    this.options = Object.assign({
      colorsEnabled: true,
      align: true,
      levels: defaultLevelColorOptions,
      params: defaultParamColorOptions,
      timestamp: defaultTimestampColorOption,
    }, options);
  }

  public noColors(): TextFormatter {
    this.options.colorsEnabled = false;
    return this;
  }

  /**
   * Correctly color and format a log message parameter.
   * @param paramColors The color options for the parameter
   * @returns A function that will color and format a parameter
   */
  private paramColorFormatter(paramColors: ParamColors): ColorFunction {
    /**
     * Correctly color and format a log message parameter.
     * @param value The value to format
     * @returns The formatted value
     */
    return (value: any) => {
      if (typeof value === "object") {
        if (Array.isArray(value)) {
          return paramColors.array(value);
        }
        return paramColors.object(value);
      }
      if (typeof value === "function") {
        return paramColors.function(value.name);
      }
      return paramColors[typeof value](value.toString());
    };
  }

  /**
   * Format a message as human readable text of the form `[TIMESTAMP | LEVEL]: MESSAGE`.
   * @param data The data to format
   * @returns The formatted data as text
   */
  public format({
    template,
    params,
    level,
    timestamp,
  }: LoggingFormatterData): string {
    if (this.options.colorsEnabled) {
      const levelName = LoggingLevel[level].toLowerCase();
      if (!(levelName in this.options.levels)) {
        throw new Error(`No color defined for level ${levelName}`);
      }
      const colorFunction = (this.options.levels as any)[levelName];
      return `${gray("[")}${this.options.timestamp(timestamp)} ${gray("|")} ${
        bold((colorFunction ?? identityColorFunction)(LoggingLevel[level]))
      }${
        this.options.align && spacingUntil(LoggingLevel[level].length, 8) ||
        ""
      }${gray("]:")} ${
        compileMessage(
          template,
          params,
          this.paramColorFormatter(this.options.params),
        )
      }`;
    } else {
      return `[${timestamp} | ${LoggingLevel[level]}${
        this.options.align &&
          spacingUntil(LoggingLevel[level].length, 8) || ""
      }]: ${compileMessage(template, params, identityColorFunction)}`;
    }
  }
}
