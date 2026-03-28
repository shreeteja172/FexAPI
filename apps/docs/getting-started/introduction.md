# Introduction

FexAPI is a schema-first CLI for generating and serving mock APIs during frontend development.

You define routes once in `fexapi/schema.fexapi`, compile them to `fexapi/generated.api.json`, and run a local API server with realistic fake data.

## Why Teams Use FexAPI

- Fast local API setup without spinning up backend services
- Clear mock contracts in versioned schema files
- Repeatable output generated from one source of truth
- Watch mode that regenerates and reloads automatically

## Mental Model

```txt
schema.fexapi -> fexapi generate -> generated.api.json -> fexapi serve/dev
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
fexapi/generated.api.json
fexapi.config.js
```

`fexapi.config.js` is optional but recommended when you want runtime options like `cors`, `delay`, or route-level overrides.

## Route Precedence

If both schema routes and `fexapi.config.js` routes define the same path, schema-generated routes are used first.

## Next Steps

- [Installation](./installation.md)
- [Quick Start](./quick-start.md)
- [CLI Commands](../cli/overview.md)
