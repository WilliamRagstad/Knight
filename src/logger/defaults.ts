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
import { LevelColors, ParamColors, TextFormatter } from "./TextFormatter.ts";

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
  object: function (o: Record<string, any>) {
    return `{${
      Object.keys(o).map((k) => `${k}: ${(this as any)[typeof o[k]](o[k])}`)
        .join(", ")
    }}`;
  },
  array: function (a: any[]) {
    return `[${a.map((v) => (this as any)[typeof v](v)).join(", ")}]`;
  },
  date: blue,
  exception: red,
}

export const defaultTimestampColorOption = (t: any) => rgb24(t, { r: 140, g: 140, b: 170 })

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