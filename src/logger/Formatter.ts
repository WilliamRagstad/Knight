import { LoggingLevel, MessageTemplateParams } from "../types.ts";

export abstract class Formatter {
  public abstract format(data: LoggingFormatterData): string;
}

export type LoggingFormatterData = {
  level: LoggingLevel;
  timestamp: string;
  template: string;
  params: MessageTemplateParams;
};
