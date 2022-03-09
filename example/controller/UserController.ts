import {
  bodyMappingJSON,
  Context,
  Controller,
  created,
  internalServerError,
  Endpoint,
  IController,
  Logger,
  ok,
  Params,
} from "../../mod.ts";

import User from "../model/User.ts";
import LoggingService from "../service/LoggingService.ts";

@Controller("/user")
export default class UserController extends IController {
  private log: Logger = LoggingService.instance().logger;

  constructor() {
    super();
    this.log.info("UserController was created");
  }

  async post({ request, response }: Context): Promise<void> {
    this.log.info("Request to: POST /user");
    const user = await bodyMappingJSON(request, User);
    this.log.debug(`User: ${user.toString()}`);
    // Do stuff ...
    const msg = `User with email ${user.email} was successfully created`;
    created(response, msg);
    this.log.success(msg);
  }

  @Endpoint("GET", "/:id/email")
  getByEmail({ id }: Params, { response }: Context): void {
    this.log.info(`Request to: GET /user/${id}/email`);
    const email = id + "@example.com";
    this.log.debug(`Email: ${email}`);
    const msg = `User with email ${email} was successfully found`;
    ok(response, msg);
    this.log.success(msg);
  }

  @Endpoint("GET", "/crash")
  crash(_: never, { response }: Context): void {
    this.log.info("Request to: GET /user/crash");
    try {
      throw new Error("This is a crash!");
    } catch (error) {
      this.log.warn(error);
      this.log.error(error);
      this.log.critical(error);
      this.log.fatal(error);
      internalServerError(response);
    }
  }
}
