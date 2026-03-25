# PUT Requests

Define PUT endpoints to simulate resource updates.

## Schema Definition

```txt
PUT /users:
  id:uuid
  name:name
  email:email
  updatedAt:date
```

## Request

```bash
curl -X PUT http://localhost:4000/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Name"}'
```

## Response

```json
{
  "users": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "name": "Jane Cooper",
      "email": "jane@example.com",
      "updatedAt": "2024-03-15T10:30:00.000Z"
    }
  ]
}
```

::: info
Like all FexAPI endpoints, PUT requests return freshly generated mock data. The request body is not used.
:::
