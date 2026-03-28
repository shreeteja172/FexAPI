# Troubleshooting

Common issues and how to fix them.

## "Route not found" (404)

**Cause:** The requested path doesn't match any defined route.

**Fix:**

1. Check the 404 response — it lists all available routes
2. Make sure you ran `fexapi generate` after editing your schema
3. Verify the HTTP method matches (`GET /users` won't match `POST /users`)

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
