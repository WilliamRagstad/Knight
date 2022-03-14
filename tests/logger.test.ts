import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import {
  ConsoleSink,
  defaultTimestamp,
  FileSink,
  Logger,
  LoggingLevel,
  timeTimestamp,
} from "../mod.ts";
import { TextFormatter } from "../mod.ts";

/** ========================================================================
 *                        Helper functions and globals
 * ========================================================================* */

const tmpLogFile = "./test.log";
const logger = new Logger()
  .attach(new ConsoleSink())
  .attach(new FileSink(tmpLogFile));
function getLogs() {
  const content = Deno.readTextFileSync(tmpLogFile);
  // Remove the file
  Deno.removeSync(tmpLogFile);
  return content;
}

/** ========================================================================
 *                        Logging tests for Knight
 * ========================================================================* */

Deno.test("Info hello world", () => {
  console.log();
  const timestamp = defaultTimestamp();
  logger.info("Hello World");
  assertEquals(getLogs(), `[${timestamp} | Info    ]: Hello World\n`);
});

Deno.test("logging alignment and template string parameters", () => {
  console.log();
  const timestamp1 = defaultTimestamp();
  logger.info("First line");
  const timestamp2 = defaultTimestamp();
  logger.critical("Second line");
  const timestamp3 = defaultTimestamp();
  logger.error("Third line");
  const timestamp4 = defaultTimestamp();
  logger.warning("Fourth line");
  const timestamp5 = defaultTimestamp();
  logger.success(
    "Fifth line, {msg} and {favNum} are the best!",
    "My message",
    1337,
  );
  const timestamp6 = defaultTimestamp();
  logger.fatal("Sixth line");
  const timestamp7 = defaultTimestamp();
  logger.debug("Seventh line");
  assertEquals(
    getLogs(),
    `[${timestamp1} | Info    ]: First line
[${timestamp2} | Critical]: Second line
[${timestamp3} | Error   ]: Third line
[${timestamp4} | Warning ]: Fourth line
[${timestamp5} | Success ]: Fifth line, My message and 1337 are the best!
[${timestamp6} | Fatal   ]: Sixth line
[${timestamp7} | Debug   ]: Seventh line\n`,
  );
});

Deno.test("Custom timestamp provider", () => {
  console.log();
  const logger = new Logger()
    .attach(new ConsoleSink(undefined, undefined, timeTimestamp))
    .attach(new FileSink(tmpLogFile, undefined, undefined, timeTimestamp));
  const timestamp = timeTimestamp();
  logger.info("Example message");
  assertEquals(getLogs(), `[${timestamp} | Info    ]: Example message\n`);
});

Deno.test("Non aligned logs", () => {
  console.log();
  const formatter = new TextFormatter({
    align: false,
  });
  const logger = new Logger()
    .attach(new ConsoleSink(undefined, formatter))
    .attach(new FileSink(tmpLogFile, undefined, formatter));
  const timestamp = defaultTimestamp();
  logger.info("Example message");
  assertEquals(getLogs(), `[${timestamp} | Info]: Example message\n`);
});

Deno.test("Logging under level", () => {
  console.log();
  const logger = new Logger()
    .attach(new ConsoleSink().fromRange(LoggingLevel.Warning))
    .attach(new FileSink(tmpLogFile).fromRange(LoggingLevel.Warning));
  logger.info("This should not be logged");
  logger.debug("This should not be logged");
  logger.warning("This should be logged");
  const timestamp = defaultTimestamp();
  assertEquals(getLogs(), `[${timestamp} | Warning ]: This should be logged\n`);
});
