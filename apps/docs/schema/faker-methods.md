# Faker Methods

Custom YAML schemas support any Faker.js method for data generation.

## How It Works

In your YAML schema files, use the `faker` property to specify a Faker.js method path:

```yaml
name:
  type: string
  faker: person.fullName
```

FexAPI resolves the path against the Faker.js library at runtime.

## Common Methods

### Person

| Faker Path | Example Output |
|------------|---------------|
| `person.fullName` | `"Jane Cooper"` |
| `person.firstName` | `"Jane"` |
| `person.lastName` | `"Cooper"` |
| `person.jobTitle` | `"Software Engineer"` |
| `person.bio` | `"passionate about coding"` |

### Internet

| Faker Path | Example Output |
|------------|---------------|
| `internet.email` | `"jane@example.com"` |
| `internet.url` | `"https://example.com"` |
| `internet.username` | `"jane_cooper"` |
| `internet.password` | `"xK9#mP2$"` |
| `internet.ip` | `"192.168.1.1"` |
| `internet.ipv6` | `"2001:0db8:85a3:..."` |

### Lorem

| Faker Path | Example Output |
|------------|---------------|
| `lorem.sentence` | `"Lorem ipsum dolor sit amet."` |
| `lorem.paragraph` | `"Lorem ipsum..."` |
| `lorem.word` | `"consectetur"` |
| `lorem.slug` | `"lorem-ipsum-dolor"` |

### Commerce

| Faker Path | Example Output |
|------------|---------------|
| `commerce.productName` | `"Ergonomic Rubber Chair"` |
| `commerce.price` | `"29.99"` |
| `commerce.department` | `"Electronics"` |

### Location

| Faker Path | Example Output |
|------------|---------------|
| `location.city` | `"San Francisco"` |
| `location.country` | `"United States"` |
| `location.streetAddress` | `"123 Main St"` |
| `location.zipCode` | `"94105"` |
| `location.latitude` | `37.7749` |

### Image

| Faker Path | Example Output |
|------------|---------------|
| `image.url` | `"https://picsum.photos/640/480"` |
| `image.avatar` | `"https://avatars..."` |

## Full Reference

FexAPI supports any valid Faker.js method path. See the [Faker.js documentation](https://fakerjs.dev/api/) for the complete list.
