# fexapi generate

Reads your `schema.fexapi` file and compiles it into the API spec used by the server.

## Usage

```bash
fexapi generate
```

## What It Does

1. Reads `fexapi/schema.fexapi`
2. Parses routes and field definitions
3. Outputs `fexapi/generated.api.json`
4. Updates `fexapi/migrations/schema.json`

## Output Files

| File | Purpose |
|------|---------|
| `fexapi/generated.api.json` | Compiled API spec — the server reads this |
| `fexapi/migrations/schema.json` | Snapshot of the current schema state |

## When to Run

Run `generate` after every change to your `schema.fexapi` file:

```bash
# edit schema
fexapi generate
fexapi serve
```

::: tip
If you use `fexapi dev --watch`, generation happens automatically when the schema file changes.
:::

## Errors

If your schema contains errors, `generate` will print them and exit with a non-zero code:

```
Unknown type "integer" in field "age". Valid types: number, string, boolean, date, uuid, email, url, name, phone
```
