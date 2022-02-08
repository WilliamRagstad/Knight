import { HTTPMethods } from "https://deno.land/x/oak/mod.ts";
import IController from "./IController.ts";
import { Constructor } from "./types.ts";

/*
	dP""b8  dP"Yb  88b 88 888888 88""Yb  dP"Yb  88     88     888888 88""Yb     8888b.  888888  dP""b8  dP"Yb  88""Yb    db    888888  dP"Yb  88""Yb .dP"Y8
	dP   `" dP   Yb 88Yb88   88   88__dP dP   Yb 88     88     88__   88__dP      8I  Yb 88__   dP   `" dP   Yb 88__dP   dPYb     88   dP   Yb 88__dP `Ybo."
	Yb      Yb   dP 88 Y88   88   88"Yb  Yb   dP 88  .o 88  .o 88""   88"Yb       8I  dY 88""   Yb      Yb   dP 88"Yb   dP__Yb    88   Yb   dP 88"Yb  o.`Y8b
	YboodP  YbodP  88  Y8   88   88  Yb  YbodP  88ood8 88ood8 888888 88  Yb     8888Y"  888888  YboodP  YbodP  88  Yb dP""""Yb   88    YbodP  88  Yb 8bodP'
*/

export function Controller(path: string) {
  return function (target: Constructor<IController>) {
    target.prototype.path = path;
  };
}

export function Endpoint(method: HTTPMethods, path: string) {
  return function (
	// deno-lint-ignore no-explicit-any
    target: Record<string, any>,
    key: string,
    descriptor: PropertyDescriptor,
  ) {
    target.constructor.prototype.endpoints =
      target.constructor.prototype.endpoints || [];
    target.constructor.prototype.endpoints.push({
      method,
      path,
      key,
      handler: descriptor.value,
    });
  };
}

/*
	8b    d8  dP"Yb  8888b.  888888 88         8888b.  888888  dP""b8  dP"Yb  88""Yb    db    888888  dP"Yb  88""Yb .dP"Y8
	88b  d88 dP   Yb  8I  Yb 88__   88          8I  Yb 88__   dP   `" dP   Yb 88__dP   dPYb     88   dP   Yb 88__dP `Ybo."
	88YbdP88 Yb   dP  8I  dY 88""   88  .o      8I  dY 88""   Yb      Yb   dP 88"Yb   dP__Yb    88   Yb   dP 88"Yb  o.`Y8b
	88 YY 88  YbodP  8888Y"  888888 88ood8     8888Y"  888888  YboodP  YbodP  88  Yb dP""""Yb   88    YbodP  88  Yb 8bodP'
*/

export function Optional() {
	// deno-lint-ignore no-explicit-any
  return function (target: Record<string, any>, propertyKey: string) {
    target.constructor.prototype.optionals =
      target.constructor.prototype.optionals || [];
    target.constructor.prototype.optionals.push(propertyKey);
  };
}
