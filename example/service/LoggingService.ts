import {
  ConsoleSink,
  FileSink,
  Logger,
  LoggingLevel,
  Service,
} from "../../mod.ts";


export default Service(class LoggingService {
  constructor() {
    this.logger = new Logger()
      .attach(new ConsoleSink())
      .attach(
        new FileSink("./example/logs/log.txt").fromRange(LoggingLevel.Success),
      );
  }

  public logger: Logger;
})
