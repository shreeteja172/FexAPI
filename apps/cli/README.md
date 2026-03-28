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

## Prisma-like Flow (Dynamic)

### 1) Initialize

```bash
pnpm dlx fexapi init
```

`fexapi init` runs an interactive setup wizard and asks:

- What port? (default: 3000)
- Enable CORS? (Y/n)
- Generate sample schemas? (Y/n)

Creates:

- `fexapi/schema.fexapi`
- `fexapi.config.json`
- `fexapi.config.js`
- `fexapi/schemas/user.yaml` and `fexapi/schemas/post.yaml` (if sample schemas are enabled)

### 2) Edit schema file

`fexapi/schema.fexapi` supports readable multi-line route fields (single-line still works):

```txt
# Server
port: 4100

# Routes
GET /users:
  id:uuid
  name:name
  email:email
  age:number
  phone:phone
  pic:url
  courseName:string

GET /courses:
  id:uuid
  courseName:string
  mentor:name

# one-line format is also valid:
# GET /users: id:uuid,name:name,email:email
```

### 3) Generate artifacts (updates migration)

```bash
npx fexapi generate
```

Generates:

- `fexapi/generated.api.json`
- `fexapi/migrations/schema.json`

### 3a) Format schema (optional)

Auto-format your schema to use readable multi-line field formatting:

```bash
npx fexapi format
```

This rewrites `fexapi/schema.fexapi` with each field on its own indented line for better readability.

### 4) Start server

```bash
npx fexapi run
# or
npx fexapi serve
# request/response logging
npx fexapi serve --log
# or dev watch mode (nodemon-like)
npx fexapi dev --watch
# watch mode + request logs
npx fexapi dev --watch --log
# or (inside local workspace package)
npm run serve
```

Server port is read from `schema.fexapi` unless overridden by CLI `--port`.

`fexapi dev --watch` auto-reloads when these files change:

- `fexapi/schema.fexapi`
- `fexapi/generated.api.json`
- `fexapi.config.js`
- `fexapi.config.json`
- `schemas/*.yaml`

`fexapi serve --log` prints request logs like:

- `[GET] /users/1 → 200 (45ms)`
- `[POST] /posts → 201 (12ms)`

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
- `schema` maps to files under `fexapi/schemas/` (for example `schema: "user"` -> `fexapi/schemas/user.yaml`); unknown names fall back to a generic record.
- `cors: true` enables CORS headers and OPTIONS preflight handling.
- `delay` adds response latency in milliseconds.

## Custom Schema Definitions

You can define custom schemas in YAML files under `fexapi/schemas/`.

```yaml
# fexapi/schemas/user.yaml
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
- Schema name is taken from filename (for example `fexapi/schemas/user.yaml` -> `schema: "user"`)
- `faker` values map to Faker paths like `person.fullName`, `internet.email`

## Features

- Schema-based mock API generation
- Local development server
- Faker.js integration
- Easy setup for testing workflows

## License

MIT
