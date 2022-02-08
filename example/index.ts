import { Knight } from "../mod.ts";
import UserController from "./controller/UserController.ts";

const app = Knight.createApi([
  new UserController(),
]);

console.log("Server ready on http://localhost:8000");

await app.listen({ port: 8000 });
