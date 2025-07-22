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

import { AppMode, type Context, IController, type Params, type Void } from "./types.ts";
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
   * @deprecated Use Knight.build() instead
   *
   * Register a list of controllers
   */
  public static registerApp(app: Application, controllers: IController[]) {
    const router = new Router();
    this.registerRouter(router, controllers);
    app.use(router.routes());
    app.use(router.allowedMethods());
  }

  /**
   * @deprecated Use Knight.build() instead
   *
   * Register a list of controllers and create a new web server
   * @param controllers List of controllers to register
   * @returns A web server that can be started
   */
  public static createApi(controllers: IController[]): Application {
    const app = new Application();
    this.registerApp(app, controllers);
    return app;
  }

  /**
   * create a new web server and connect controllers in the local project.
   * @returns A web server that can be started
   */
  public static async build(logger?: Logger): Promise<Application> {
    const app = new Application();
    const router = new Router();

    // Register all controllers
    if (logger) {
      logger.debug(`Searching for controllers in ${Deno.cwd()}`);
    }
    const controllers = await this.findLocalControllersIn(Deno.cwd());
    if (this._mode == AppMode.DEV && logger) {
      logger.debug(`Found ${controllers.length} controllers: ${controllers.map(c => c.constructor.name).join(", ")}`);
    }
    this.registerRouter(router, controllers);

    app.use(router.routes());
    app.use(router.allowedMethods());

    return app;
  }

  /**
   * Find all controllers in the local project
   */
  private static async findLocalControllersIn(directory: string): Promise<IController[]> {
    const controllers: IController[] = [];
    for await (const file of Deno.readDir(directory)) {
      const path = `${directory}/${file.name}`;
      if (file.isDirectory) {
        const subControllers = await this.findLocalControllersIn(path);
        controllers.push(...subControllers);
      } else if (file.isFile && file.name.endsWith("Controller.ts")) {
        const module = await import(`file://${path}`);
        const defaultController = module.default;
        // Check that the default controller implements IController
        // console.log(module, defaultController);
        if (
          defaultController && defaultController.prototype &&
          defaultController.prototype.constructor
        ) {
          // Instantiate the default controller
          const c = new (defaultController)();
          if (c instanceof IController) {
            controllers.push(c);
          } else {
            console.error(
              `Controller ${file.name} does not implement IController`,
            );
          }
        } else {
          console.warn(`${path} does not export a valid default controller!`);
        }
      }
    }
    return controllers;
  }

  public static async start(port: number = 8080, logger?: Logger): Promise<void> {
    const app = await this.build(logger);
    if (this._mode === AppMode.DEV) {
      app.use(async (ctx, next) => {
        console.log(`${ctx.request.method} ${ctx.request.url}`);
        await next();
      });
    }
    if (isNaN(port) || port <= 0) {
      throw new Error(`Invalid port number: ${port}`);
    }
    const cyan = "\x1b[36m";
    const green = "\x1b[32m";
    const yellow = "\x1b[33m";
    const italic = "\x1b[3m";
    const reset = "\x1b[0m";
    const modeStr = (this._mode === AppMode.DEV ? yellow + "development" : green + "production") + reset;
    const versionStr = cyan + "v" + denoJson.version + reset;
    const banner = `Starting Knight ${versionStr} in ${modeStr} mode
 _   __      _       _     _   
| | / /     (_)     | |   | |  
| |/ / _ __  _  __ _| |__ | |_ 
|    \\| '_ \\| |/ _' | '_ \\| __\|
| |\\  \\ | | | | (_| | | | | |_
\\_| \\_/_| |_|_|\\__, |_| |_|\\__\|
=============== __/ \|==========
${italic}By @WilliamR${reset}   |___\/  ${versionStr}
`;
    if (logger) {
      logger.log(banner);
      logger.info(`Listening on ${cyan}http://localhost:${port}${reset}`);
    } else {
      console.log(banner);
      console.info(`Listening on ${cyan}http://localhost:${port}${reset}`);
    }
    await app.listen({ port: Number(port) });
  }
}
