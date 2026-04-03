# Commands Overview

FexAPI keeps the command surface intentionally small and composable.

## How It Works

```txt
schema.fexapi -> fexapi generate -> .cache/generated.api.json -> fexapi serve/dev
```

`fexapi.config.js` fits beside that flow as the runtime override layer for port, CORS, delay, and route-level settings. See [Configuration](../getting-started/configuration.md) for the precedence rules.

## Core Commands

| Command              | Writes                                                 | Watch behavior | Best for                                          |
| -------------------- | ------------------------------------------------------ | -------------- | ------------------------------------------------- |
| `fexapi init`        | `fexapi/schema.fexapi`, `fexapi.config.js`             | No             | Bootstrapping a new project                       |
| `fexapi generate`    | `fexapi/.cache/generated.api.json`                     | No             | Refreshing the cached API spec after schema edits |
| `fexapi format`      | `fexapi/schema.fexapi`                                 | No             | Normalizing schema formatting                     |
| `fexapi serve`       | None                                                   | No             | Running the server once                           |
| `fexapi dev --watch` | `fexapi/.cache/generated.api.json` when schema changes | Yes            | Iterating locally with auto-reload                |

## Aliases and Global Commands

- `fexapi run` is an alias for `fexapi serve`
- `fexapi` (no subcommand) behaves like `fexapi serve`
- `fexapi --host ...`, `fexapi --port ...`, and `fexapi --log` also map to `serve`
- `fexapi --version` and `fexapi version` print the installed version
- `fexapi --help` prints full command help
- `fexapi help` also prints full command help

Detailed pages:

- [`init`](./init.md)
- [`generate`](./generate.md)
- [`format`](./format.md)
- [`serve`](./serve.md)
- [`dev`](./dev.md)

## Common Workflows

Use this if you want the shortest route from zero to running:

New project:

```bash
fexapi init
# edit fexapi/schema.fexapi
fexapi generate
fexapi serve
```

Active frontend development:

```bash
fexapi dev --watch --log
```

Watch mode reacts to changes under `fexapi/` and project root config, and regenerates when schema inputs change.

## Common Gotchas

- `init` creates the starter files, but it does not serve anything by itself.
- `generate` writes the cached spec, but it does not start the server.
- `serve` runs once and exits on shutdown signals; it does not watch files.
- `dev --watch` is the only command that auto-regenerates on schema changes.

Port and route precedence are documented once in [Configuration](../getting-started/configuration.md).

Before pushing changes:

```bash
fexapi format
fexapi generate
```

## Global Flags

| Flag              | Description               |
| ----------------- | ------------------------- |
| `--help`, `-h`    | Show help for any command |
| `--version`, `-v` | Print CLI version         |

Commands reject unexpected positional arguments and duplicate flags.

Port values are validated and must be an integer between `1` and `65535`.
