# Introduction

FexAPI is a schema-first CLI for generating and serving mock APIs during frontend development.

You define routes once in `fexapi/schema.fexapi`, compile them to `fexapi/.cache/generated.api.json`, and run a local API server with realistic fake data.

## Why Teams Use FexAPI

- Fast local API setup without spinning up backend services
- Clear mock contracts in versioned schema files
- Repeatable output generated from one source of truth
- Watch mode that regenerates and reloads automatically

## Mental Model

```txt
schema.fexapi -> fexapi generate -> .cache/generated.api.json -> fexapi serve/dev
```

`fexapi.config.js` feeds runtime settings into the same flow, and the full port/route precedence rules live in [Configuration](./configuration.md).

## Which Command When

| Task                                          | Command              |
| --------------------------------------------- | -------------------- |
| Create the starter files                      | `fexapi init`        |
| Regenerate the cached spec after schema edits | `fexapi generate`    |
| Reformat schema files                         | `fexapi format`      |
| Run the server once                           | `fexapi serve`       |
| Develop with automatic reloads                | `fexapi dev --watch` |

If you remember one thing, remember this flow:

```txt
init -> edit schema -> generate -> serve or dev --watch
```

## Startup Workflow

```bash
fexapi init
# edit fexapi/schema.fexapi
fexapi generate
fexapi dev --watch
```

## Files You Actually Need

```txt
fexapi/schema.fexapi
fexapi/.cache/generated.api.json
fexapi.config.js
```

`fexapi.config.js` is optional but recommended when you want runtime options like `cors`, `delay`, or route-level overrides.

## Next Steps

- [Installation](./installation.md)
- [Quick Start](./quick-start.md)
- [CLI Commands](../cli/overview.md)
