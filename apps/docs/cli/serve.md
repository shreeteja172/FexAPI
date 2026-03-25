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

All three forms are equivalent.

## Flags

| Flag | Default | Description |
|------|---------|-------------|
| `--host <host>` | `127.0.0.1` | Host to bind the server to |
| `--port <number>` | Schema port or `4000` | Port to listen on |
| `--log` | `false` | Print request/response logs |

## Port Priority

```
--port flag → schema.fexapi port → config file port → 4000
```

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
