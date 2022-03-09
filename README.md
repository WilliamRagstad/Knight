<div align="center">
	<table>
	<tbody>
	<td>
	<img src="https://raw.githubusercontent.com/WilliamRagstad/Knight/main/assets/logo.png" width="150px">
	</td>
	<td>
	<h1>Knight</h1>
	<p>
		A MVC REST framework for Deno 🦕 built on <a href="https://deno.land/x/oak@v10.2.0">Oak</a> and inspired by Spring.<br/>
		Build scalable controller-based CRUD APIs with ease.
	</p>
	</td>
	</tbody>
	</table>
	<p>
		<img alt="GitHub Workflow Status" src="https://img.shields.io/github/workflow/status/WilliamRagstad/Knight/Deno?style=flat-square">
		<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
		<img alt="All Contributors" src="https://img.shields.io/badge/all_contributors-1-g.svg?style=flat-square"/>
		<!-- ALL-CONTRIBUTORS-BADGE:END -->
		<img alt="GitHub release" src="https://img.shields.io/github/release/WilliamRagstad/Knight?style=flat-square"/>
		<img alt="Deno" src="https://img.shields.io/badge/deno-1.18.0+-green.svg?style=flat-square"/>
	</p>
</div>

## About

This framework allows you to create a rich REST API with just a few lines of
code. The web server is powered by [Oak](https://oakserver.github.io/oak/) and
utilizes Deno’s native HTTP server and builds upon the existing middleware and
routing stack, to allow for automatic endpoint generation.

Focus on what you want to do, and the framework will take care of the rest.

## Documentation

> ### View the full [technical documentation](https://doc.deno.land/https://deno.land/x/knight/mod.ts).

## Getting Started

You can use the knight framework in three different ways, start by importing the
latest version of the `Knight` module. Now either let Knight create a new server
instance, or use an existing Oak application. In the example below we will use
the former.

<br/>

`/index.ts`

```ts
import { Knight } from "https://deno.land/x/knight/mod.ts";

const app = await Knight.build();

console.log("Server ready on http://localhost:8000");
await app.listen({ port: 8000 });
```

In this introduction, the `Knight.build()` function will find and use the
`UserController` class from an example below.

<br/>

> ### Project Structure
>
> We suggest that the project structure is as follows:
>
> ```
> /
> ├── controller/
> │   └── UserController.ts
> ├── model/
> │   └── User.ts
> ├── index.ts
> ```
>
> All files named `*Controller.ts` are automatically found and used by the
> framework.

<br/>

Now let's create the `UserController` class. By default the framework provides a
`IController` class, which is a base class for all controllers and provides a
set of overloadable methods that are common to all controllers. Such methods
include `get`, `getById`, `post`, `delete` and `put`. Though you can easily
define your own custom endpoints using the `@Endpoint` decorator.

<br/>

`/controller/UserController.ts`

```ts
import {
  bodyMappingJSON,
  Context,
  Controller,
  created,
  Endpoint,
  IController,
  ok,
  Params,
} from "https://deno.land/x/knight/mod.ts";

import User from "../model/User.ts";

@Controller("/user")
export default class UserController extends IController {
  async post({ request, response }: Context): Promise<void> {
    const user = await bodyMappingJSON(request, User);
    created(response, `User ${user.firstName} was successfully created`);
  }

  @Endpoint("GET", "/:id/email")
  getByEmail({ id }: Params, { response }: Context): void {
    const email = id + "@example.com";
    ok(response, `User with email ${email} was successfully found`);
  }
}
```

<br/>

The controller class is responsible for handling all requests to the endpoint.
Knight comes with a set of built-in mapping functions that can be used to handle
request of different DTO classes. One of these functions is `bodyMappingJSON`.
This function takes a request and a class and returns the parsed body as an
instance of the class. In the example above, the request body is parsed as a
JSON object and returned as an instance of the `User` class.

Creating a model class is as easy as defining a regular class. Mark nullable, or
optional properties with the `?` symbol and the `@Optional` decorator to signify
that the property is optional to body mapping functions.

<br/>

`/model/User.ts`

```ts
import { Optional } from "../../mod.ts";

export default class User {
  firstName: string;
  lastName: string;
  email: string;
  @Optional()
  country: string;
  @Optional()
  city?: string;
  @Optional()
  phone?: number;

  constructor(
    firstName: string,
    lastName: string,
    email: string,
    country: string,
    city?: string,
    phone?: number,
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.country = country;
    this.city = city;
    this.phone = phone;
  }
}
```

<br/>

> View the source code for this example code on
> [GitHub](https://github.com/WilliamRagstad/Knight/example).

## Endpoints

As described in the previous section, the framework provides a set of
overloadable methods that are commonly used through the `IController` class.
These methods are:

- `get(ctx: Context): void | Promise<void>`
- `getById(id: string, ctx: Context): void | Promise<void>`
- `post(ctx: Context): void | Promise<void>`
- `delete(id: string, ctx: Context): void | Promise<void>`
- `put(id: string, ctx: Context): void | Promise<void>`

All of these methods are overloaded to accept a `Context` object, which is a
type provided by Knight to allow for easy access to the request and response
objects. As well as the `Params` object for custom `@Endpoint` methods, which
contains the parameters passed to the endpoint.

All of these have full support for asynchronous alternatives, which means that
you can use `async`/`await` and return a `Promise` from the controller method
and the framework will adapt the response accordingly.

## Contribute

All contributions are welcome! Create an issue or pull request on
[GitHub](https://github.com/WilliamRagstad/Knight) to help us improve the
framework.

## Contributors ✨

Thanks goes to these wonderful people
([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://www.williamragstad.com/"><img src="https://avatars.githubusercontent.com/u/41281398?v=4?s=100" width="100px;" alt=""/><br /><sub><b>William Rågstad</b></sub></a><br /><a href="https://github.com/WilliamRagstad/Knight/commits?author=WilliamRagstad" title="Code">💻</a> <a href="#infra-WilliamRagstad" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/WilliamRagstad/Knight/commits?author=WilliamRagstad" title="Tests">⚠️</a> <a href="https://github.com/WilliamRagstad/Knight/commits?author=WilliamRagstad" title="Documentation">📖</a> <a href="#tutorial-WilliamRagstad" title="Tutorials">✅</a> <a href="#design-WilliamRagstad" title="Design">🎨</a> <a href="#example-WilliamRagstad" title="Examples">💡</a> <a href="#ideas-WilliamRagstad" title="Ideas, Planning, & Feedback">🤔</a> <a href="#platform-WilliamRagstad" title="Packaging/porting to new platform">📦</a> <a href="#plugin-WilliamRagstad" title="Plugin/utility libraries">🔌</a> <a href="#content-WilliamRagstad" title="Content">🖋</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the
[all-contributors](https://github.com/all-contributors/all-contributors)
specification. Contributions of any kind welcome!
