import {
  bodyMappingJSON,
  Context,
  Controller,
  created,
  Endpoint,
  IController,
  ok,
  Params,
} from "../../mod.ts";

import User from "../model/User.ts";

@Controller("/user")
export default class UserController extends IController {
  async post({ request, response }: Context): Promise<void> {
    const user = await bodyMappingJSON(request, User);
    // Do stuff ...
    created(response, `User ${user.firstName} was successfully created`);
  }

  @Endpoint("GET", "/:id/email")
  getByEmail({ id }: Params, { response }: Context): void {
    const email = id + "@example.com";
    ok(response, `User with email ${email} was successfully found`);
  }
}
