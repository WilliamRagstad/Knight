import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

import { AppMode, Knight } from "../mod.ts";

/** ========================================================================
 *                        General tests for Knight
 * ========================================================================* */

Deno.test("Knight: app mode", () => {
  Knight.setMode(AppMode.PROD);
  assertEquals(Knight.getMode(), AppMode.PROD);
});
