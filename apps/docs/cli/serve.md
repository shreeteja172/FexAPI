# fexapi serve

Starts the mock API server.

## Usage

```bash
fexapi serve [--host <host>] [--port <number>] [--log]
```

## Aliases

```bash
fexapi run [--host <host>] [--port <number>] [--log]
fexapi [--host <host>] [--port <number>] [--log]
```

All three forms resolve to the same serve path.

## Flags

| Flag              | Default               | Description                 |
| ----------------- | --------------------- | --------------------------- |
| `--host <host>`   | `localhost`           | Host to bind the server to  |
| `--port <number>` | Schema port or `4000` | Port to listen on           |
| `--log`           | `false`               | Print request/response logs |

## Port Priority

```
--port flag → fexapi.config.js port → generated schema port → 4000
```

Generated schema port comes from `fexapi/.cache/generated.api.json`.

## Route Sources and Precedence

- Routes can come from both `fexapi.config.js` and generated schema output.
- If the same path exists in both, schema routes take precedence.
- Custom schema definitions are loaded from `fexapi/schemas` when present.
- If no config routes are defined and no generated schema is available, the CLI warns you to run `fexapi generate`.

## Request Logging

With `--log` enabled, every request is logged:

```
[GET] /users → 200 (12ms)
[POST] /posts → 201 (8ms)
[GET] /unknown → 404 (2ms)
```

## Examples

```bash
fexapi serve
fexapi serve --port 5000
fexapi serve --host 0.0.0.0 --port 3000 --log
```

## Validation Rules

- Unknown options fail fast.
- Duplicate options fail fast.
- `--port` must be an integer between `1` and `65535`.
- Unexpected positional arguments fail fast.
