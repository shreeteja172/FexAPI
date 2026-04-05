# Quick Start

Get a mock API running in under 2 minutes.

## 1. Initialize

::: code-group

```bash [npm]
npx fexapi@latest init
```

```bash [pnpm]
pnpm dlx fexapi@latest init
```

```bash [bun]
bunx fexapi@latest init
```

```bash [yarn]
yarn dlx fexapi@latest init
```

:::

The wizard asks:

| Prompt       | Default |
| ------------ | ------- |
| Port number  | `4000`  |
| Enable CORS? | `Yes`   |

This creates your project files:

```
fexapi/schema.fexapi
fexapi.config.js
```

## 2. Define Your Schema

Open `fexapi/schema.fexapi` and define your endpoints:

```txt
port: 4000

GET /users:
  id:uuid
  name:name
  email:email
  age:number

GET /posts:
  id:uuid
  title:string
  body:string
  published:boolean
```

Each route declares an HTTP method, path, and a list of fields with their types.

## 3. Generate

::: code-group

```bash [npm]
npx fexapi generate
```

```bash [pnpm]
pnpm dlx fexapi generate
```

```bash [bun]
bunx fexapi generate
```

```bash [yarn]
yarn dlx fexapi generate
```

:::

This reads your schema and outputs `fexapi/.cache/generated.api.json`.

## 4. Start the Server

::: code-group

```bash [npm]
npx fexapi dev --watch
```

```bash [pnpm]
pnpm dlx fexapi dev --watch
```

```bash [bun]
bunx fexapi dev --watch
```

```bash [yarn]
yarn dlx fexapi dev --watch
```

:::

`dev --watch` will regenerate and reload when `fexapi/schema.fexapi`, `fexapi.config.js`, or custom schema YAML files change.

Your mock API is now running. Try it:

```bash
curl http://localhost:4000/users
```

Response:

```json
{
  "users": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "name": "John Smith",
      "email": "john.smith@example.com",
      "age": 34
    }
  ]
}
```

## 5. Control Record Count

Add a `count` query parameter to get more records:

```bash
curl http://localhost:4000/users?count=20
```

Returns 20 user records. Maximum is 50.

For routes defined in `fexapi.config.js`, `count` query values override the route `count` (still clamped to `1-50`).

## What's Next

- [Configuration](./configuration.md) — customize ports, CORS, and delays
- [Schema Guide](../schema/basics.md) — learn the full schema format
- [CLI Reference](../cli/overview.md) — all available commands
