import { assertEquals } from "@std/assert";
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
  logger.success("Fifth line");
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
[${timestamp5} | Success ]: Fifth line
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

Deno.test("Message template strings with different parameter types", () => {
  console.log();
  const timestamp = defaultTimestamp();
  logger.info("Example message with {msg} and {favNum}", "My message", 1337);
  logger.debug("My object: {obj}", {
    foo: "bar",
    baz: "qux",
  });
  logger.info("My array: {arr}", ["foo", "bar", "baz"]);
  logger.critical("My nums: {arr}", [1, 2, 3]);
  logger.success("My bools: {arr}", [true, false, true]);
  logger.debug("{data}", ["string", 1337, { foo: "bar" }]);
  logger.warning("Lots of data:\n{data}", {
    deep: {
      object: {
        with: {
          lots: {
            of: {
              data: "here",
            },
          },
        },
      },
      array: [
        1,
        2,
        3,
        "this was the last one",
      ],
    },
    short: {
      array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    },
    long: {
      array: [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
      ],
    },
  });
  assertEquals(
    getLogs(),
    `[${timestamp} | Info    ]: Example message with My message and 1337
[${timestamp} | Debug   ]: My object: {foo: "bar", baz: "qux"}
[${timestamp} | Info    ]: My array: ["foo", "bar", "baz"]
[${timestamp} | Critical]: My nums: [1, 2, 3]
[${timestamp} | Success ]: My bools: [true, false, true]
[${timestamp} | Debug   ]: ["string", 1337, {foo: "bar"}]
[${timestamp} | Warning ]: Lots of data:
{
  deep: {
    object: {
      with: {
        lots: {of: {data: "here"}}
      }
    },
    array: [
      1,
      2,
      3,
      "this was the last one"
    ]
  },
  short: {
    array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  },
  long: {
    array: [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21
    ]
  }
}
`,
  );
});
