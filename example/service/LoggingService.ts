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
        new FileSink("./example/logs/log.txt").fromRange(LoggingLevel.Success),
      );
  }

  public logger: Logger;
}
