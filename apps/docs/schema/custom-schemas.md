# Custom Schemas

For more control over data generation, define custom schemas as YAML files.

## File Location

```
fexapi/schemas/<name>.yaml
```

Reference them in `fexapi.config.js` by filename (without extension):

```js
module.exports = {
  routes: {
    "/users": { count: 50, schema: "user" },
  },
};
```

`schema: "user"` resolves to `fexapi/schemas/user.yaml`.

## Schema Format

Each field has a `type` and optional properties:

```yaml
name:
  type: string
  faker: person.fullName

email:
  type: string
  faker: internet.email

age:
  type: number
  min: 18
  max: 80

active:
  type: boolean
```

## Field Properties

| Property | Type     | Description                                                                                 |
| -------- | -------- | ------------------------------------------------------------------------------------------- |
| `type`   | `string` | Field type — `string`, `number`, `boolean`, `date`, `uuid`, `email`, `url`, `name`, `phone` |
| `faker`  | `string` | Faker.js method path. Overrides default generation for the type.                            |
| `min`    | `number` | Minimum value (for `number` type)                                                           |
| `max`    | `number` | Maximum value (for `number` type)                                                           |

## Supported Extensions

- `.yaml`
- `.yml`

## Fallback Behavior

If a schema name in `fexapi.config.js` doesn't match any file in `fexapi/schemas/`, FexAPI generates a fallback record:

```json
{
  "id": "uuid",
  "type": "schema-name",
  "value": "random words",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

## Example: Full Schema

```yaml
id:
  type: uuid

firstName:
  type: string
  faker: person.firstName

lastName:
  type: string
  faker: person.lastName

email:
  type: string
  faker: internet.email

age:
  type: number
  min: 18
  max: 65

avatar:
  type: string
  faker: image.avatar

joinedAt:
  type: date
```
