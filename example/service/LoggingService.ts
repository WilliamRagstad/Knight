import { ConsoleSink, FileSink, Logger, LoggingLevel } from "../../mod.ts";

export default class LoggingService {
  private static _instance: LoggingService;
  public static get instance(): LoggingService {
    if (!LoggingService._instance) {
      LoggingService._instance = new LoggingService();
    }
    return LoggingService._instance;
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
