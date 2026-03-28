# fexapi dev

Starts the development server with optional file watching and auto-reload.

## Usage

```bash
fexapi dev [--watch] [--host <host>] [--port <number>] [--log]
```

## Flags

| Flag              | Default               | Description                                    |
| ----------------- | --------------------- | ---------------------------------------------- |
| `--watch`         | `false`               | Auto-reload when config or schema files change |
| `--host <host>`   | `127.0.0.1`           | Host to bind to                                |
| `--port <number>` | Schema port or `4000` | Port to listen on                              |
| `--log`           | `false`               | Print request/response logs                    |

## Watched Files

When `--watch` is enabled, the server reloads on changes to:

- `fexapi/schema.fexapi`
- `fexapi/generated.api.json`
- `fexapi.config.js`
- `fexapi.config.json`
- `fexapi/schemas/*.yaml`

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
