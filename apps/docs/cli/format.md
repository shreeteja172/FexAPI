# fexapi format

Auto-formats your `schema.fexapi` file to use readable multi-line field formatting.

## Usage

```bash
fexapi format
```

## What It Does

Parses `fexapi/schema.fexapi` and rewrites it to canonical multi-line structure:

- `# Server`
- `port: <number>`
- `# Routes`
- one route per block with indented fields

### Before

```txt
GET /users: id:uuid,name:name,email:email,age:number
```

### After

```txt
GET /users:
  id:uuid
  name:name
  email:email
  age:number
```

Both formats are valid. The multi-line format is easier to read and maintain.

If schema parsing fails, the command exits with errors and does not write output.

## When to Use

Run `format` after:

- Writing routes in single-line format
- Copying schema definitions from documentation
- Merging schema changes from multiple sources
