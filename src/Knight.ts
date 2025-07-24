// deno-lint-ignore-file no-explicit-any
import {
  Application,
  type HTTPMethods,
  type RouteParams,
  Router,
  type RouterContext,
  type RouterMiddleware,
  type State,
} from "@oak/oak";

import { AppMode, type Context, type IController, type Params, type Void } from "./types.ts";
import type { Logger } from './logger/Logger.ts';

import denoJson from "../deno.json" with { type: "json" };

export class Knight {
  private static _mode = AppMode.DEV;

  public static setMode(mode: AppMode) {
    this._mode = mode;
  }
  public static getMode(): AppMode {
    return this._mode;
  }

  private static endpointHandler<
    R extends string,
    P extends RouteParams<R> = RouteParams<R>,
    S extends State = Record<string, any>,
  >(thisArg: any, handler: RouterMiddleware<R, P, S>) {
    if (this._mode === AppMode.DEV) {
      // Return exception stack trace in development mode
      return async (
        ctx: RouterContext<R, P, S>,
        next: () => Promise<unknown>,
      ): Promise<void> => {
        try {
          await handler.call(thisArg, ctx, next);
        } catch (error) {
          ctx.response.status = 500;
          ctx.response.body = {
            status: 500,
            message: error instanceof Error ? error.message : String(error),
          };
        }
      };
    } else {
      // Return internal server error in production mode
      return async (
        ctx: RouterContext<R, P, S>,
        next: () => Promise<unknown>,
      ): Promise<unknown> => await handler.call(thisArg, ctx, next);
    }
  }

  /**
   * Register a list of controllers
   */
  private static registerRouter(
    router: Router<Record<string, any>>,
    controllers: IController[],
  ) {
    for (const controller of controllers) {
      const basePath: string = (controller as any).constructor.prototype.path ??
        "/"; // Default to root
      controller.get &&
        router.get(basePath, this.endpointHandler(controller, controller.get));
      controller.getById &&
        router.get(
          `${basePath}/:id`,
          this.endpointHandler(
            controller,
            (ctx) =>
              controller.getById &&
              controller.getById(ctx.params.id, ctx as any),
          ),
        );
      controller.post &&
        router.post(
          basePath,
          this.endpointHandler(controller, controller.post),
        );
      controller.delete &&
        router.delete(
          `${basePath}/:id`,
          this.endpointHandler(
            controller,
            (ctx) =>
              controller.delete && controller.delete(ctx.params.id, ctx as any),
          ),
        );
      controller.put &&
        router.put(
          `${basePath}/:id`,
          this.endpointHandler(
            controller,
            (ctx) =>
              controller.put && controller.put(ctx.params.id, ctx as any),
          ),
        );

      // Add custom endpoints
      const endpoints = controller.constructor.prototype.endpoints;
      if (endpoints) {
        for (const endpoint of endpoints) {
          const fullPath = basePath + endpoint.path;
          // console.log(`Registering custom endpoint ${endpoint.method} ${fullPath}`, endpoint);
          const method: HTTPMethods = endpoint.method.toUpperCase();
          const handler = endpoint
            .handler as ((params: Params, ctx: Context) => Void);
          const wrapper = this.endpointHandler(
            controller,
            (ctx) => handler.call(controller, ctx.params, ctx),
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
   * create a new web server and connect controllers in the local project.
   * @returns A web server that can be started
   */
  public static build(controllers: IController[]): Application {
    const app = new Application();
    const router = new Router();

    // Register all controllers
    Knight.registerRouter(router, controllers);

    app.use(router.routes());
    app.use(router.allowedMethods());

    return app;
  }


  /**
   * Starts the web server with the given controllers on the specified port.
   * 
   * @example
   * ```ts
   * import { Knight, Controller } from "@knight/knight";
   *
   * @Controller("/my-controller")
   * export default class MyController extends IController {
   *     get({ response }: Context) {
   *         ok(response, "Hello from MyController!");
   *     }
   * }
   * Knight.start([MyController], 8080);
   * ```
   * @param controllers The list of controllers to register
   * @param port The port to listen on, defaults to 8080
   * @param logger An optional logger instance
   */
  public static async start(controllers: IController[], port: number = 8080, logger?: Logger): Promise<void> {
    if (isNaN(port) || port <= 0) {
      throw new Error(`Invalid port number: ${port}`);
    }
    const app = this.build(controllers);
    if (this._mode === AppMode.DEV) {
      app.use(async (ctx, next) => {
        logger?.debug(`${ctx.request.method} ${ctx.request.url}`);
        await next();
      });
    }
    const cyan = "\x1b[36m";
    const darkGrey = "\x1b[90m";
    const green = "\x1b[32m";
    const orange = "\x1b[38;5;208m";
    const yellow = "\x1b[33m";
    const italic = "\x1b[3m";
    const reset = "\x1b[0m";
    const modeStr = (this._mode === AppMode.DEV ? yellow + "development" : green + "production") + reset;
    const versionStr = cyan + "v" + denoJson.version + reset;
    const banner = ` _   __      _       _     _   ${orange}__ _ _${reset}
| | / /     (_)     | |   | |  ${orange}\\ \\ \\ \\${reset}
| |/ / _ __  _  __ _| |__ | |_ ${orange} \\ \\ \\ \\${reset}
|    \\| '_ \\| |/ _' | '_ \\| __\|${orange}  ) ) ) )${reset}
| |\\  \\ | | | | (_| | | | | |_ ${orange} / / / /${reset}
|_| \\_/_| |_|_|\\__, |_| |_|\\__\|${orange}/_/_/_/${reset}
${darkGrey}===============${reset}|___\/${darkGrey}=================${reset}
:: ${green}Knight${reset} ${versionStr} ${darkGrey}${italic}By WilliamRagstad${reset} ::
`;
    const plural = controllers.length === 1 ? "" : "s";
    const starting = `Starting Knight ${versionStr} in ${modeStr} mode with ${controllers.length} controller${plural}`;
    const listening = `Listening on ${cyan}http://localhost:${port}${reset}`;
    console.log(banner);
    if (logger) {
      logger.info(starting);
      logger.info(listening);
    } else {
      console.info(starting);
      console.info(listening);
    }
    await app.listen({ port });
  }
}
