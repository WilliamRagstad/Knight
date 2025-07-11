import { assertEquals } from "@std/assert";

import { AppMode, Knight } from "../mod.ts";

/** ========================================================================
 *                        General tests for Knight
 * ========================================================================* */

Deno.test("Knight: app mode", () => {
  Knight.setMode(AppMode.PROD);
  assertEquals(Knight.getMode(), AppMode.PROD);
});
