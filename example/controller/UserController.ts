import {
  badRequest,
  bodyMappingJSON,
  type Context,
  Controller,
  created,
  Endpoint,
  IController,
  internalServerError,
  type Logger,
  ok,
  type Params,
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

  override get({ response }: Context): void {
    this.log.info("Request to: GET /user");
    const msg = "Cannot get all users";
    badRequest(response, msg);
    this.log.error(msg);
  }

  override async post({ request, response }: Context): Promise<void> {
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
      let err = error instanceof Error ? error.message : String(error);
      this.log.warning(err);
      this.log.error(err);
      this.log.critical(err);
      this.log.fatal(err);
      internalServerError(response);
    }
  }
}
