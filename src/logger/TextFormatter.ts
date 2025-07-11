// deno-lint-ignore-file no-explicit-any
import { bold, gray } from "@std/fmt/colors";
import { LoggingLevel } from "../types.ts";
import {
  defaultLevelColorOptions,
  defaultParamColorOptions,
  defaultTimestampColorOption,
} from "./defaults.ts";
import { Formatter, type LoggingFormatterData } from "./Formatter.ts";
import { compileMessage } from "./parser.ts";

function spacingUntil(current: number, length: number): string {
  return " ".repeat(length - current);
}

/**
 * Format a string using the standard library `std/fmt/colors.ts` or custom function.
 */
export type ColorFunction = (str: any) => string;

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
  objectKey: ColorFunction;
  object: (
    obj: Record<string, any>,
    prm: ColorFunction,
    params: ParamColors,
    colors: boolean,
  ) => string;
  array: (
    arr: any[],
    prm: ColorFunction,
    params: ParamColors,
    colors: boolean,
  ) => string;
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
  private paramColorFormatter(
    paramColors: ParamColors,
    colorsEnabled: boolean,
  ): ColorFunction {
    /**
     * Correctly color and format a log message parameter.
     * @param value The value to format
     * @returns The formatted value
     */
    return (value: any) => {
      if (typeof value === "object") {
        if (Array.isArray(value)) {
          return paramColors.array(
            value,
            this.paramColorFormatter(paramColors, colorsEnabled),
            paramColors,
            colorsEnabled,
          );
        }
        return paramColors.object(
          value,
          this.paramColorFormatter(paramColors, colorsEnabled),
          paramColors,
          colorsEnabled,
        );
      }
      if (typeof value === "function") {
        return colorsEnabled ? paramColors.function(value.name) : value.name;
      }
      return colorsEnabled
        ? paramColors[typeof value](
          value.toString(),
          this.paramColorFormatter(paramColors, colorsEnabled),
          paramColors,
          colorsEnabled,
        )
        : value.toString();
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
        bold(colorFunction(LoggingLevel[level]))
      }${
        this.options.align && spacingUntil(LoggingLevel[level].length, 8) ||
        ""
      }${gray("]:")} ${
        compileMessage(
          template,
          params,
          this.paramColorFormatter(this.options.params, true),
        )
      }`;
    } else {
      return `[${timestamp} | ${LoggingLevel[level]}${
        this.options.align &&
          spacingUntil(LoggingLevel[level].length, 8) || ""
      }]: ${
        compileMessage(
          template,
          params,
          this.paramColorFormatter(this.options.params, false),
        )
      }`;
    }
  }
}
