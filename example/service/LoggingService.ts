import {
  ConsoleSink,
  FileSink,
  Logger,
  LoggingLevel,
  Service,
} from "../../mod.ts";

export default Service(
  class LoggingService {
    public logger: Logger;
    constructor() {
      this.logger = new Logger()
        .attach(new ConsoleSink())
        .attach(
          new FileSink("./example/logs/log.txt").fromRange(
            LoggingLevel.Success,
          ),
        );
    }
  },
);
