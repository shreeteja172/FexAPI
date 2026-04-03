# Configuration

FexAPI configuration is loaded from `fexapi.config.js` in your project root.

CLI flags override file values at runtime.

## Config File

```js
module.exports = {
  port: 4000,
  cors: true,
  delay: 200,
  routes: {
    "/users": { count: 20, schema: "user" },
  },
};
```

## Options Reference

| Option   | Type      | Default | Description                                |
| -------- | --------- | ------- | ------------------------------------------ |
| `port`   | `number`  | `4000`  | Server port. CLI `--port` overrides this.  |
| `cors`   | `boolean` | `false` | Enable CORS headers and OPTIONS preflight. |
| `delay`  | `number`  | `0`     | Response delay in milliseconds.            |
| `routes` | `object`  | `{}`    | Optional route-level overrides.            |

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

| Property | Type     | Description                                               |
| -------- | -------- | --------------------------------------------------------- |
| `count`  | `number` | Number of records to return (`1-50`)                      |
| `schema` | `string` | Schema name that resolves to `fexapi/schemas/<name>.yaml` |

If the schema name doesn't match any file in `fexapi/schemas/`, FexAPI falls back to a generic record structure.

## Schema File vs Config Routes

FexAPI supports two ways to define routes:

|                 | `schema.fexapi`      | `fexapi.config.js` routes |
| --------------- | -------------------- | ------------------------- |
| **Format**      | DSL                  | JavaScript                |
| **Best for**    | Primary API contract | Count/schema overrides    |
| **Data source** | Generated API spec   | Runtime route config      |

Both can be used together. If the same path appears in both, schema-generated routes take precedence.

## Port and Route Precedence

```
CLI flags → fexapi.config.js port → generated schema port → 4000
```

For route precedence, schema-generated routes also win when the same path exists in both places.

## Next Steps

- [CLI Reference](../cli/overview.md) — all available commands and flags
- [Custom Schemas](../schema/custom-schemas.md) — YAML schema definitions
