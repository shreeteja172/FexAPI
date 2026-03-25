# DELETE Requests

Define DELETE endpoints to simulate resource deletion.

## Schema Definition

```txt
DELETE /users:
  id:uuid
  deleted:boolean
  deletedAt:date
```

## Request

```bash
curl -X DELETE http://localhost:4000/users
```

## Response

```json
{
  "users": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "deleted": true,
      "deletedAt": "2024-03-15T10:30:00.000Z"
    }
  ]
}
```

::: info
FexAPI does not persist state. DELETE requests return generated data — nothing is actually deleted.
:::
