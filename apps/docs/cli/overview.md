# Commands Overview

FexAPI provides a small set of focused commands.

## Pick the Right Command

| Goal                                           | Command              |
| ---------------------------------------------- | -------------------- |
| Set up files in a new project                  | `fexapi init`        |
| Rebuild generated artifacts after schema edits | `fexapi generate`    |
| Reformat `schema.fexapi` for readability       | `fexapi format`      |
| Run server once (no auto-reload)               | `fexapi serve`       |
| Run server with auto-reload during development | `fexapi dev --watch` |

## Command Reference

| Command           | Description                      |
| ----------------- | -------------------------------- |
| `fexapi init`     | Scaffold config and schema files |
| `fexapi generate` | Compile schema into API spec     |
| `fexapi format`   | Auto-format your schema file     |
| `fexapi serve`    | Start the mock server            |
| `fexapi dev`      | Start the server with watch mode |
| `fexapi --help`   | Show help                        |

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

Before pushing changes:

```bash
fexapi format
fexapi generate
```

## Global Flags

| Flag           | Description               |
| -------------- | ------------------------- |
| `--help`, `-h` | Show help for any command |

Commands reject unexpected positional arguments and duplicate flags.

## Aliases

`fexapi run` is an alias for `fexapi serve`. Running `fexapi` without a command also starts the server.
