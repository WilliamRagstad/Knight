import type { Constructor, HTTPMethods, IController } from "./types.ts";

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
  // deno-lint-ignore no-explicit-any
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log(target);
    console.log(descriptor);
    if (!target.constructor.prototype.endpoints) {
      target.constructor.prototype.endpoints = [];
    }
    target.constructor.prototype.endpoints.push({
      method,
      path,
      propertyKey,
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

/*
	.dP"Y8 888888 88""Yb Yb    dP 88  dP""b8 888888     8888b.  888888  dP""b8  dP"Yb  88""Yb    db    888888  dP"Yb  88""Yb .dP"Y8
	`Ybo." 88__   88__dP  Yb  dP  88 dP   `" 88__        8I  Yb 88__   dP   `" dP   Yb 88__dP   dPYb     88   dP   Yb 88__dP `Ybo."
	o.`Y8b 88""   88"Yb    YbdP   88 Yb      88""        8I  dY 88""   Yb      Yb   dP 88"Yb   dP__Yb    88   Yb   dP 88"Yb  o.`Y8b
	8bodP' 888888 88  Yb    YP    88  YboodP 888888     8888Y"  888888  YboodP  YbodP  88  Yb dP""""Yb   88    YbodP  88  Yb 8bodP'
*/

export function Service<T>(target: Constructor<T>) {
  const singletonTarget = target as unknown as Constructor<T> & {
    instance: () => T;
    _instance: T;
  };
  singletonTarget.instance = () => {
    if (!singletonTarget._instance) {
      singletonTarget._instance = new target();
    }
    return singletonTarget._instance;
  };
  return singletonTarget;
}
