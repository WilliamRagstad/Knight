import { Context } from "https://deno.land/x/oak/mod.ts";

export default abstract class IController {
  path = "/";

  /**
   * METHOD GET /
   * @description Fetch all instances of the relevant model
   * @param ctx Oak request context
   */
  get?(ctx: Context): void | Promise<void>;

  /**
   * METHOD GET /:id
   * @description Fetch a single instance of the relevant model
   * @param id Id of the resource
   * @param ctx Oak request context
   */
  getById?(id: string, ctx: Context): void | Promise<void>;

  /**
   * METHOD POST /
   * @description Create a new instance of the relevant model
   * @param ctx Oak request context
   */
  post?(ctx: Context): void | Promise<void>;

  /**
   * METHOD DELETE /:id
   * @description Delete a single instance of the relevant model
   * @param id Id of the resource
   * @param ctx Oak request context
   */
  delete?(id: string, ctx: Context): void | Promise<void>;

  /**
   * METHOD PUT /:id
   * @description Update a single instance of the relevant model
   * @param id Id of the resource
   * @param ctx Oak request context
   */
  put?(id: string, ctx: Context): void | Promise<void>;
}
