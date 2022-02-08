import IController from "./IController.ts";
import {
  Application,
  HTTPMethods,
  RouteParams,
  Router,
  RouterContext,
  RouterMiddleware,
  State,
} from "https://deno.land/x/oak/mod.ts";
import { StringEndpoint } from "./types.ts";

export enum AppMode {
  DEV,
  PROD,
}
export class ControllerManager {
  private static _mode = AppMode.DEV;

  public static setMode(mode: AppMode) {
    this._mode = mode;
  }
  public static getMode() {
    return this._mode;
  }

  private static endpointHandler<
    R extends string,
    P extends RouteParams<R> = RouteParams<R>,
    // deno-lint-ignore no-explicit-any
    S extends State = Record<string, any>,
  >(handler: RouterMiddleware<R, P, S>) {
    if (this._mode === AppMode.DEV) {
      // Return exception stack trace in development mode
      return async (
        ctx: RouterContext<R, P, S>,
        next: () => Promise<unknown>,
      ): Promise<void> => {
        try {
          await handler(ctx, next);
        } catch (error) {
          ctx.response.status = 500;
          ctx.response.body = {
            status: 500,
            message: error.message,
          };
        }
      };
    } else {
      // Return internal server error in production mode
      return async (
        ctx: RouterContext<R, P, S>,
        next: () => Promise<unknown>,
      ): Promise<unknown> => await handler(ctx, next);
    }
  }

  /**
   * Register a list of controllers
   */
  public static registerRouter(
    router: Router<Record<string, any>>,
    controllers: IController[],
  ) {
    for (const controller of controllers) {
      // deno-lint-ignore no-explicit-any
      const basePath: string = (controller as any).constructor.prototype.path ??
        "/"; // Default to root
      controller.get &&
        router.get(basePath, this.endpointHandler(controller.get));
      controller.getById &&
        router.get(
          `${basePath}/:id`,
          this.endpointHandler((ctx) =>
            controller.getById && controller.getById(ctx.params.id, ctx)
          ),
        );
      controller.post &&
        router.post(basePath, this.endpointHandler(controller.post));
      controller.delete &&
        router.delete(
          `${basePath}/:id`,
          this.endpointHandler((ctx) =>
            controller.delete && controller.delete(ctx.params.id, ctx)
          ),
        );
      controller.put &&
        router.put(
          `${basePath}/:id`,
          this.endpointHandler((ctx) =>
            controller.put && controller.put(ctx.params.id, ctx)
          ),
        );

      // Add custom endpoints
      const endpoints = controller.constructor.prototype.endpoints;
      if (endpoints) {
        for (const endpoint of endpoints) {
          const fullPath = basePath + endpoint.path;
          // console.log(`Registering custom endpoint ${endpoint.method} ${fullPath}`, endpoint);
          const method: HTTPMethods = endpoint.method.toUpperCase();
          const handler = endpoint.handler as StringEndpoint;
          const wrapper = this.endpointHandler((ctx) =>
            handler(ctx.params, ctx)
          );
          switch (method) {
            case "GET":
              router.get(fullPath, wrapper);
              break;
            case "POST":
              router.post(fullPath, wrapper);
              break;
            case "DELETE":
              router.delete(fullPath, wrapper);
              break;
            case "PUT":
              router.put(fullPath, wrapper);
              break;
            case "PATCH":
              router.patch(fullPath, wrapper);
              break;
            case "HEAD":
              router.head(fullPath, wrapper);
              break;
            case "OPTIONS":
              router.options(fullPath, wrapper);
              break;

            default:
              throw new Error(
                `Unsupported method ${method} in custom endpoint ${fullPath}`,
              );
          }
        }
      }
    }
  }

  /**
   * Register a list of controllers
   */
  public static registerApp(app: Application, controllers: IController[]) {
    const router = new Router();
    this.registerRouter(router, controllers);
    app.use(router.routes());
    app.use(router.allowedMethods());
  }

  /**
   * Register a list of controllers and create a new web server
   * @param controllers List of controllers to register
   * @returns A web server that can be started
   */
  public static createApi(controllers: IController[]) {
    const app = new Application();
    this.registerApp(app, controllers);
    return app;
  }
}
