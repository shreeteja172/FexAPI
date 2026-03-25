# CORS Configuration

Enable Cross-Origin Resource Sharing to allow requests from your frontend dev server.

## Enable CORS

### Via Config File

```js
module.exports = {
  cors: true,
}
```

### Via Init Wizard

When running `fexapi init`, select "Yes" when asked about CORS.

## What CORS Enables

When `cors: true`, FexAPI adds these headers to every response:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET,POST,PUT,PATCH,DELETE,OPTIONS
Access-Control-Allow-Headers: Content-Type,Authorization
```

It also handles `OPTIONS` preflight requests automatically with a `204` status.

## When You Need It

Enable CORS when your frontend and mock API run on different ports:

```
Frontend:  http://localhost:3000
FexAPI:    http://localhost:4000
```

Without CORS, browsers will block cross-origin requests from your frontend to the mock API.

## Example

```js
module.exports = {
  port: 4000,
  cors: true,
  routes: {
    "/users": { count: 10, schema: "user" },
  },
}
```

Your React/Vue/Angular app at `localhost:3000` can now fetch from `localhost:4000` without issues.
