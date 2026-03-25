# Configuration

FexAPI supports configuration through both JSON and JavaScript files.

## Config Files

FexAPI looks for configuration in this order:

1. `fexapi.config.js` — JavaScript config (recommended)
2. `fexapi.config.json` — JSON config

CLI flags always take priority over config file values.

## JavaScript Config

```js
module.exports = {
  port: 3000,
  cors: true,
  delay: 200,
  routes: {
    "/users": { count: 50, schema: "user" },
    "/posts": { count: 100, schema: "post" },
  },
}
```

## JSON Config

```json
{
  "port": 3000,
  "cors": true,
  "delay": 0
}
```

## Options Reference

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `port` | `number` | `4000` | Server port. CLI `--port` overrides this. |
| `cors` | `boolean` | `false` | Enable CORS headers and OPTIONS preflight. |
| `delay` | `number` | `0` | Response delay in milliseconds. |
| `routes` | `object` | `{}` | Route-to-schema mappings. |

## Routes Config

The `routes` object maps endpoint paths to their configuration:

```js
routes: {
  "/users": {
    count: 50,
    schema: "user"
  }
}
```

| Property | Type | Description |
|----------|------|-------------|
| `count` | `number` | Number of records to return |
| `schema` | `string` | Schema name — maps to `schemas/<name>.yaml` |

If the schema name doesn't match any file in `schemas/`, FexAPI falls back to a generic record structure.

## Schema File vs Config File

FexAPI supports two ways to define routes:

| | `schema.fexapi` | `fexapi.config.js` |
|---|---|---|
| **Format** | Custom DSL | JavaScript |
| **Field types** | Inline (`name:email`) | YAML schema files |
| **Best for** | Quick prototyping | Complex schemas with Faker methods |

Both can be used together. Config routes and schema routes are merged at startup.

## Priority Order

```
CLI flags → schema.fexapi port → config file port → defaults
```

## Next Steps

- [CLI Reference](/cli/overview) — all available commands and flags
- [Custom Schemas](/schema/custom-schemas) — YAML schema definitions
