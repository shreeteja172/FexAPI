# Troubleshooting

Common issues and how to fix them.

## Quick Diagnosis Checklist

Run these in order when something feels off:

```bash
fexapi --help
fexapi generate
fexapi serve --log
```

If `generate` fails, fix schema errors first. If `serve` starts but responses are not what you expect, check route source priority in the logs.

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

**Cause:** `fexapi/generated.api.json` does not exist yet.

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

**Cause:** `fexapi.config.js` routes take precedence when present.

**Fix:**

1. Remove or adjust the `routes` object in `fexapi.config.js`
2. Keep only schema-driven routes if you want generated routes exclusively
3. Restart `serve`/`dev`

## "No routes defined in schema.fexapi"

**Cause:** The schema file exists but has no valid route definitions.

**Fix:**

1. Check the syntax of `fexapi/schema.fexapi`
2. Each route needs: `METHOD /path: field:type`
3. Run `fexapi format` to normalize the file

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

**Cause:** FexAPI can't find `fexapi.config.js` or `fexapi.config.json`.

**Fix:**

1. Make sure the config file is in the project root (where you run the command)
2. Check file naming — it must be `fexapi.config.js` or `fexapi.config.json`

## Watch mode not reloading

**Cause:** The changed file isn't in the watched file list.

**Watched files:**

- `fexapi/schema.fexapi`
- `fexapi/generated.api.json`
- `fexapi.config.js`
- `fexapi.config.json`
- `fexapi/schemas/*.yaml`

Make sure you're using `fexapi dev --watch` (not `fexapi serve`).

## Faker method not applied

**Cause:** Invalid Faker path in YAML (for example typo in `faker: person.fullname`).

**Fix:**

1. Use valid Faker method paths such as `person.fullName`, `internet.email`, `image.avatar`
2. Keep `type` set correctly even when using `faker`
3. Restart `dev --watch` or rerun `serve`
