# POST Requests

Define POST endpoints in your schema to simulate resource creation.

## Schema Definition

```txt
POST /users:
  id:uuid
  name:name
  email:email
  createdAt:date
```

## Request

```bash
curl -X POST http://localhost:4000/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Jane", "email": "jane@example.com"}'
```

## Response

FexAPI returns generated data regardless of the request body:

```json
{
  "users": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "name": "John Smith",
      "email": "john@example.com",
      "createdAt": "2024-03-15T10:30:00.000Z"
    }
  ]
}
```

::: info
FexAPI does not persist data. POST requests return generated mock data, just like GET requests. The request body is not used for response generation.
:::

## Use Cases

POST endpoints are useful for:

- Testing form submissions
- Simulating API calls in component development
- Verifying error handling in your frontend
