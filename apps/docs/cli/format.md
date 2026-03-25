# fexapi format

Auto-formats your `schema.fexapi` file to use readable multi-line field formatting.

## Usage

```bash
fexapi format
```

## What It Does

Rewrites `fexapi/schema.fexapi` so each field is on its own indented line.

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

## When to Use

Run `format` after:
- Writing routes in single-line format
- Copying schema definitions from documentation
- Merging schema changes from multiple sources
