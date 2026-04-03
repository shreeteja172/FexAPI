# Commands Overview

FexAPI keeps the command surface intentionally small and composable.

## Core Commands

| Command              | Use it for                                                    |
| -------------------- | ------------------------------------------------------------- |
| `fexapi init`        | Scaffold project files (`schema.fexapi` + `fexapi.config.js`) |
| `fexapi generate`    | Compile schema routes into `.cache/generated.api.json`        |
| `fexapi format`      | Normalize and reformat `schema.fexapi`                        |
| `fexapi serve`       | Start server once without watch                               |
| `fexapi dev --watch` | Auto-generate and auto-reload during development              |

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
