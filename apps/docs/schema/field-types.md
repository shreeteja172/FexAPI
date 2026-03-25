# Field Types

FexAPI supports the following built-in field types in your `schema.fexapi` file.

## Available Types

| Type | Generated Value | Example Output |
|------|----------------|----------------|
| `uuid` | UUID v4 string | `"a1b2c3d4-e5f6-7890-abcd-ef1234567890"` |
| `string` | Random words (1–4) | `"lorem ipsum dolor"` |
| `number` | Random integer (1–10000) | `4827` |
| `boolean` | `true` or `false` | `true` |
| `date` | ISO 8601 date string | `"2024-03-15T10:30:00.000Z"` |
| `email` | Fake email address | `"john.smith@example.com"` |
| `url` | Fake URL | `"https://example.com/path"` |
| `name` | Full person name | `"Jane Cooper"` |
| `phone` | Phone number | `"+1-555-123-4567"` |

## Usage in Schema

```txt
GET /users:
  id:uuid
  username:string
  email:email
  fullName:name
  age:number
  website:url
  phone:phone
  verified:boolean
  createdAt:date
```

## Type Validation

If you use an invalid type, `fexapi generate` will report an error:

```
Unknown type "integer" in field "age". Valid types: number, string, boolean, date, uuid, email, url, name, phone
```

## Need More Control?

For advanced data generation with specific Faker.js methods, min/max ranges, or custom logic, use [YAML custom schemas](/schema/custom-schemas) instead.
