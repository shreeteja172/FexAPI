# fexapi dev

Starts the development server with optional file watching and auto-reload.

## Usage

```bash
fexapi dev [--watch] [--host <host>] [--port <number>] [--log]
```

If `--watch` is not provided, `dev` runs as a one-shot server start (same behavior as `serve` with the same host/port/log options).

## Flags

| Flag              | Default               | Description                                    |
| ----------------- | --------------------- | ---------------------------------------------- |
| `--watch`         | `false`               | Auto-reload when config or schema files change |
| `--host <host>`   | `localhost`           | Host to bind to                                |
| `--port <number>` | Schema port or `4000` | Port to listen on                              |
| `--log`           | `false`               | Print request/response logs                    |

## Watched Files

When `--watch` is enabled, the server reloads on changes to:

- `fexapi/schema.fexapi`
- `fexapi/.cache/generated.api.json`
- `fexapi.config.js`
- `fexapi/schemas/*.yaml` and `fexapi/schemas/*.yml`
- other files under `fexapi/` (restart only)

When schema-related files change, `dev --watch` regenerates `fexapi/.cache/generated.api.json` before reloading the server.

Watch reloads are debounced, and generation-triggered updates to `fexapi/.cache/generated.api.json` are temporarily suppressed to prevent duplicate reload loops.

## Examples

```bash
fexapi dev --watch
fexapi dev --watch --log
fexapi dev --watch --port 5000 --log
```

## Difference from `serve`

|               | `serve`         | `dev --watch` |
| ------------- | --------------- | ------------- |
| Starts server | ✅              | ✅            |
| File watching | ❌              | ✅            |
| Auto-reload   | ❌              | ✅            |
| Use case      | Production-like | Development   |

## Validation Rules

- Unknown options fail fast.
- Duplicate options fail fast.
- `--port` must be an integer between `1` and `65535`.
- Unexpected positional arguments fail fast.
