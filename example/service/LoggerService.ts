import { ConsoleSink, FileSink, Logger, LoggingLevel } from "../../mod.ts";

export default class LoggerService {
  private static _instance: LoggerService;
  public static get instance(): LoggerService {
    if (!LoggerService._instance) {
      LoggerService._instance = new LoggerService();
    }
    return LoggerService._instance;
  }

  constructor() {
    this.logger = new Logger()
      .attach(new ConsoleSink())
      .attach(
        new FileSink("logs/log.txt").fromRange(LoggingLevel.Log),
      );
  }

  public logger: Logger;
}
