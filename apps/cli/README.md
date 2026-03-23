# FexAPI

Frontend Experience API - Mock API generation CLI tool for local development and testing.

## Installation

```bash
npm install -g fexapi
```

## Usage

```bash
fexapi [options]
```

## Configuration File Support

Create a `fexapi.config.js` in your project root:

```js
// fexapi.config.js
module.exports = {
  port: 3000,
  routes: {
    "/users": { count: 50, schema: "user" },
    "/posts": { count: 100, schema: "post" },
  },
  cors: true,
  delay: 200,
};
```

Then run:

```bash
fexapi serve
```

Notes:

- `port` sets the default server port (CLI `--port` still has priority).
- `routes` maps endpoint paths to generated payload settings.
- `schema` supports `user`, `post`, and falls back to a generic record for unknown values.
- `cors: true` enables CORS headers and OPTIONS preflight handling.
- `delay` adds response latency in milliseconds.

## Custom Schema Definitions

You can define custom schemas in YAML files under `schemas/`.

```yaml
# schemas/user.yaml
name:
  type: string
  faker: person.fullName
email:
  type: string
  faker: internet.email
age:
  type: number
  min: 18
  max: 80
```

Then reference it in `fexapi.config.js`:

```js
routes: {
  "/users": { count: 50, schema: "user" }
}
```

Notes:

- Supported file extensions: `.yaml`, `.yml`
- Schema name is taken from filename (for example `schemas/user.yaml` -> `schema: "user"`)
- `faker` values map to Faker paths like `person.fullName`, `internet.email`

## Features

- Schema-based mock API generation
- Local development server
- Faker.js integration
- Easy setup for testing workflows

## License

MIT
