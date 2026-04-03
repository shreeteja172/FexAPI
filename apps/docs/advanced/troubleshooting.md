# Troubleshooting

Common issues and how to fix them.

## Fast Lookup

| Symptom                         | Most likely fix                                                                |
| ------------------------------- | ------------------------------------------------------------------------------ |
| Nothing starts                  | Run `fexapi init` in a project root                                            |
| Generate fails                  | Fix `fexapi/schema.fexapi` and rerun `fexapi generate`                         |
| Server says no generated schema | Run `fexapi generate` first                                                    |
| Sidebar routes look wrong       | Check route precedence in [Configuration](../getting-started/configuration.md) |
| Watch mode does not reload      | Confirm `fexapi dev --watch` and the file is in the watch list                 |
| Port conflict                   | Pick a different `--port` value                                                |

## Quick Diagnosis Checklist

Run these in order when something feels off:

```bash
fexapi --help
fexapi generate
fexapi dev --watch --log
```

If `generate` fails, fix schema errors first. If the server starts but responses are unexpected, check route source and watch logs.

## "Could not find package.json"

**Cause:** You are running the CLI outside a Node project root (or nested directory without a parent `package.json`).

**Fix:**

1. Run commands from your app/project root (where `package.json` exists)
2. Or initialize a Node project first:

```bash
npm init -y
fexapi init
```

## "Schema file not found: .../fexapi/schema.fexapi"

**Cause:** You ran `generate` or `serve` before initialization.

**Fix:**

```bash
fexapi init
fexapi generate
fexapi serve
```

## "No generated schema found..."

**Cause:** `fexapi/.cache/generated.api.json` does not exist yet.

**Fix:** Run:

```bash
fexapi generate
```

Then restart the server.

## "Route not found" (404)

**Cause:** The requested path doesn't match any defined route.

**Fix:**

1. Check the 404 response — it lists all available routes
2. Make sure you ran `fexapi generate` after editing your schema
3. Verify the HTTP method matches (`GET /users` won't match `POST /users`)

## "Expected schema routes, but config routes are being used"

**Cause:** Route overlap between generated schema routes and `fexapi.config.js`.

**Fix:**

1. Review the canonical precedence rules in [Configuration](../getting-started/configuration.md)
2. Keep your source-of-truth route in `fexapi/schema.fexapi`
3. Remove overlapping path entries in `fexapi.config.js` routes
4. Regenerate and restart

## "No routes defined in schema.fexapi"

**Cause:** The schema file exists but has no valid route definitions.

**Fix:**

1. Check the syntax of `fexapi/schema.fexapi`
2. Each route needs: `METHOD /path: field:type`
3. Run `fexapi format` to normalize the file

## Port and route precedence

See [Configuration](../getting-started/configuration.md) for the single source of truth on config, generated schema, and CLI flag precedence.

## Port already in use

**Cause:** Another process is using the same port.

**Fix:**

```bash
fexapi serve --port 5000
```

Or stop the other process using that port.

Windows (find process on a port):

```powershell
netstat -ano | findstr :4000
taskkill /PID <pid> /F
```

macOS/Linux:

```bash
lsof -i :4000
kill -9 <pid>
```

## CORS errors in browser

**Cause:** CORS is not enabled.

**Fix:** Add `cors: true` to your `fexapi.config.js`:

```js
module.exports = {
  cors: true,
};
```

## Schema type errors

**Cause:** Using an invalid field type.

**Valid types:** `number`, `string`, `boolean`, `date`, `uuid`, `email`, `url`, `name`, `phone`

```txt
GET /users:
  age:integer    # ❌ invalid
  age:number     # ✅ correct
```

## Config file not loading

**Cause:** FexAPI can't find `fexapi.config.js` from the current project root.

**Fix:**

1. Make sure the config file is in the project root (where you run the command)
2. Check file naming — it must be `fexapi.config.js`

## Watch mode not reloading

**Cause:** The changed file isn't in the watched file list.

**Watched files:**

- `fexapi/schema.fexapi`
- `fexapi/.cache/generated.api.json`
- `fexapi.config.js`
- `fexapi/schemas/*.yaml` and `fexapi/schemas/*.yml`
- other files under `fexapi/` (restart only)

Make sure you're using `fexapi dev --watch` (not `fexapi serve`).

If schema parsing fails while watching, the server keeps running with the last valid generated state. Fix the schema and save again.

## Faker method not applied

**Cause:** Invalid Faker path in YAML (for example typo in `faker: person.fullname`).

**Fix:**

1. Use valid Faker method paths such as `person.fullName`, `internet.email`, `image.avatar`
2. Keep `type` set correctly even when using `faker`
3. Restart `dev --watch` or rerun `serve`
