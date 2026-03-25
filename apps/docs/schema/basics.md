# Schema Basics

The `.fexapi` schema file is where you define your mock API endpoints.

## File Location

```
fexapi/schema.fexapi
```

Created automatically by `fexapi init`.

## Syntax

A schema file contains two things: a **port** declaration and **route definitions**.

```txt
port: 4000

GET /users:
  id:uuid
  name:name
  email:email
  age:number

GET /posts:
  id:uuid
  title:string
  body:string
```

## Port

Declares the server port. Optional — defaults to `4000`.

```txt
port: 4100
```

## Routes

Each route has three parts:

```txt
METHOD /path:
  fieldName:fieldType
```

- **METHOD** — HTTP method (`GET`, `POST`, `PUT`, `DELETE`)
- **/path** — The endpoint path
- **fields** — One or more `name:type` pairs

Supported methods are: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, `OPTIONS`.

## Single-Line Format

You can also write fields on a single line, comma-separated:

```txt
GET /users: id:uuid,name:name,email:email
```

Both formats are equivalent. Use `fexapi format` to convert single-line to multi-line.

## Comments

Lines starting with `#` are comments:

```txt
# Server configuration
port: 4000

# User endpoints
GET /users:
  id:uuid
  name:name
```

Inline comments are also supported:

```txt
port: 4000 # local dev port

GET /users:
  id:uuid # primary key
  name:name
```

## Validation Rules

- Route definitions must be unique per `METHOD + /path`.
- Field names must use letters, numbers, or `_` and cannot start with a number.
- Field definitions must use strict `name:type` format.
- Field names must be unique within a route.

## Multiple Routes

Define as many routes as you need:

```txt
port: 4000

GET /users:
  id:uuid
  name:name
  email:email

GET /products:
  id:uuid
  title:string
  price:number

GET /orders:
  id:uuid
  total:number
  date:date
```
