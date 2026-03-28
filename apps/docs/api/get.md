# GET Requests

FexAPI serves GET endpoints defined in your schema or config file.

## Schema-Based GET

Define GET routes in `schema.fexapi`:

```txt
GET /users:
  id:uuid
  name:name
  email:email
```

Request:

```bash
curl http://localhost:4000/users
```

Response:

```json
{
  "users": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "name": "Jane Cooper",
      "email": "jane@example.com"
    }
  ]
}
```

## Config-Based GET

Define routes in `fexapi.config.js`:

```js
module.exports = {
  routes: {
    "/users": { count: 20, schema: "user" },
  },
};
```

This maps `/users` to `fexapi/schemas/user.yaml` and returns 20 records.

## Record Count

Control the number of records with the `count` query parameter:

```bash
curl http://localhost:4000/users?count=10
```

- Default: `5` records (schema routes) or config-specified count
- Minimum: `1`
- Maximum: `50`

For config-based routes, adding `?count=<n>` overrides the configured route count for that request.

## Response Key

The response wraps records in a key derived from the last path segment:

| Path            | Response Key |
| --------------- | ------------ |
| `/users`        | `users`      |
| `/api/products` | `products`   |
| `/`             | `data`       |
