# Quick Start

Get a mock API running in under 2 minutes.

## 1. Initialize

```bash
npx fexapi init
```

The wizard will ask:

| Prompt                   | Default |
| ------------------------ | ------- |
| Port number              | `3000`  |
| Enable CORS?             | `Yes`   |
| Generate sample schemas? | `Yes`   |

This creates your project files:

```
fexapi/schema.fexapi
fexapi.config.json
fexapi.config.js
fexapi/schemas/user.yaml
fexapi/schemas/post.yaml
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

```bash
npx fexapi generate
```

This reads your schema and outputs `fexapi/generated.api.json`.

## 4. Start the Server

```bash
npx fexapi dev --watch
```

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

- [Configuration](/getting-started/configuration) — customize ports, CORS, and delays
- [Schema Guide](/schema/basics) — learn the full schema format
- [CLI Reference](/cli/overview) — all available commands
