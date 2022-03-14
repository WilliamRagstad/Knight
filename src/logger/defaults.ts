// deno-lint-ignore-file no-explicit-any
import {
  blue,
  brightBlue,
  brightMagenta,
  cyan,
  gray,
  green,
  italic,
  magenta,
  red,
  rgb24,
  white,
  yellow,
} from "https://deno.land/std@0.128.0/fmt/colors.ts";
import { ColorFunction, LevelColors, ParamColors } from "./TextFormatter.ts";

/**
 * Default color options for the `ConsoleSink` class.
 */
export const defaultLevelColorOptions: LevelColors = {
  log: white,
  info: cyan,
  success: green,
  debug: gray,
  warning: (s: any) => rgb24(s, { r: 255, g: 219, b: 88 }),
  error: red,
  critical: (s: any) => rgb24(s, { r: 255, g: 115, b: 60 }),
  fatal: red,
};

function valueHRF(data: any) {
  if (["string", "symbol"].includes(typeof data)) {
    return `"${data}"`;
  }
  return data;
}

export function objectColorFunction(
  obj: Record<string, any>,
  prm: ColorFunction,
  params: ParamColors,
  colors: boolean,
  indent = 0,
): string {
  const indentation = " ".repeat(indent);
  const indentation2 = " ".repeat(indent + 2);
  const keys = Object.keys(obj);
  const formattedValues = keys.reduce(
    (acc: Record<string, any>, key: string) => {
      acc[key] = prm(valueHRF(obj[key])).split("\n").join("\n" + indentation2);
      return acc;
    },
    {},
  );
  const formattedKeys = keys.map((key: string) => {
    return `${colors ? params.objectKey(key) : key}: ${formattedValues[key]}`;
  });

  const longestValue = keys.reduce(
    (acc: number, key: string) => {
      return Math.max(acc, JSON.stringify(obj[key]).length);
    },
    0,
  );
  const maxSizeThreshold = 20;
  return longestValue > maxSizeThreshold || keys.length > maxSizeThreshold
    ? `${indentation}{\n${
      indentation2 + formattedKeys.join(",\n" + indentation2)
    }\n${indentation}}`
    : `${indentation}{${formattedKeys.join(", ")}${indentation}}`;
}

export function arrayColorFunction(
  arr: any[],
  prm: ColorFunction,
  params: ParamColors,
  colors: boolean,
  indent = 0,
): string {
  const indentation = " ".repeat(indent);
  const indentation2 = " ".repeat(indent + 2);
  const formattedValues = arr.map((v: any) =>
    prm(valueHRF(v)).split("\n").join("\n" + indentation2)
  );
  const longestValue = arr.reduce((acc: number, v: any) => {
    return Math.max(acc, JSON.stringify(v).length);
  }, 0);
  const maxSizeThreshold = 20;
  return longestValue > maxSizeThreshold || arr.length > maxSizeThreshold
    ? `${indentation}[\n${
      indentation2 + formattedValues.join(",\n" + indentation2)
    }\n${indentation}]`
    : `${indentation}[${formattedValues.join(", ")}${indentation}]`;
}

export const defaultParamColorOptions: ParamColors = {
  string: cyan,
  number: magenta,
  integer: yellow,
  bigint: yellow,
  boolean: brightBlue,
  undefined: (s: any) => italic(gray(s)),
  null: (s: any) => italic(gray(s)),
  function: blue,
  symbol: brightMagenta,
  objectKey: gray,
  object: objectColorFunction,
  array: arrayColorFunction,
  date: blue,
  exception: red,
};

export const defaultTimestampColorOption = (t: any) =>
  rgb24(t, { r: 140, g: 140, b: 170 });

/**
 * The current timestamp in the international ISO standard for specifying dates.
 * @returns The current timestamp
 */
export const isoTimestamp = (): string => new Date().toISOString();

function padded(d: any, length: number, char: string): string {
  return d.toString().padStart(length, char);
}
function paddedNumber(n: number, length: number): string {
  return padded(n, length, "0");
}

export const dateTimestamp = (): string => {
  const d = new Date();
  return `${paddedNumber(d.getFullYear(), 4)}-${
    paddedNumber(d.getMonth() + 1, 2)
  }-${paddedNumber(d.getDate(), 2)}`;
};

export const timeTimestamp = (): string => {
  const d = new Date();
  return `${paddedNumber(d.getHours(), 2)}:${paddedNumber(d.getMinutes(), 2)}:${
    paddedNumber(d.getSeconds(), 2)
  }`;
};

/**
 * @returns
 */
export const defaultTimestamp = (): string => {
  return `${dateTimestamp()} ${timeTimestamp()}`;
};
