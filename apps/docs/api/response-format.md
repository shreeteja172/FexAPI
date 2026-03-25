# Response Format

All FexAPI responses follow a consistent structure.

## Structure

```json
{
  "<collectionKey>": [
    { ...record },
    { ...record }
  ]
}
```

The collection key is derived from the last segment of the request path.

## Collection Key Rules

| Request Path | Collection Key |
|-------------|----------------|
| `/users` | `users` |
| `/api/posts` | `posts` |
| `/v1/products` | `products` |
| `/` | `data` |

Special characters in the path segment are replaced with underscores.

## Content Type

All responses are `application/json`.

## Status Codes

| Status | When |
|--------|------|
| `200` | Route matched successfully |
| `204` | OPTIONS preflight (when CORS enabled) |
| `404` | Route not found |

## 404 Response

When a route is not found, FexAPI returns all available routes:

```json
{
  "message": "Route not found",
  "availableRoutes": [
    "GET /users",
    "GET /posts",
    "POST /users"
  ]
}
```

## CORS Headers

When CORS is enabled, responses include:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET,POST,PUT,PATCH,DELETE,OPTIONS
Access-Control-Allow-Headers: Content-Type,Authorization
```

## Response Delay

If `delay` is configured, all responses are delayed by the specified milliseconds:

```js
module.exports = {
  delay: 200,
}
```

This is useful for testing loading states in your frontend.
