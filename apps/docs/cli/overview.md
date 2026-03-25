# Commands Overview

FexAPI provides a small set of focused commands.

## Command Summary

| Command           | Description                      |
| ----------------- | -------------------------------- |
| `fexapi init`     | Scaffold config and schema files |
| `fexapi generate` | Compile schema into API spec     |
| `fexapi format`   | Auto-format your schema file     |
| `fexapi serve`    | Start the mock server            |
| `fexapi dev`      | Start the server with watch mode |
| `fexapi --help`   | Show help                        |

## Typical Workflow

```bash
fexapi init
# edit fexapi/schema.fexapi
fexapi generate
fexapi dev --watch
```

## Global Flags

| Flag           | Description               |
| -------------- | ------------------------- |
| `--help`, `-h` | Show help for any command |

Commands reject unexpected positional arguments and duplicate flags.

## Aliases

`fexapi run` is an alias for `fexapi serve`. Running `fexapi` without a command also starts the server.
