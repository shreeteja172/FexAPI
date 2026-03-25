# Example Schemas

Copy-paste-ready schemas for common use cases.

## User API

### Schema file

```txt
GET /users:
  id:uuid
  name:name
  email:email
  age:number
  phone:phone
  pic:url
```

### YAML schema

```yaml
id:
  type: uuid

name:
  type: string
  faker: person.fullName

email:
  type: string
  faker: internet.email

age:
  type: number
  min: 18
  max: 65

phone:
  type: string
  faker: phone.number

avatar:
  type: string
  faker: image.avatar
```

## E-Commerce

```txt
GET /products:
  id:uuid
  name:string
  price:number
  inStock:boolean
  category:string

GET /orders:
  id:uuid
  total:number
  status:string
  date:date

GET /reviews:
  id:uuid
  rating:number
  comment:string
  author:name
```

## Blog

```txt
GET /posts:
  id:uuid
  title:string
  body:string
  author:name
  published:boolean
  createdAt:date

GET /comments:
  id:uuid
  body:string
  author:name
  postId:uuid
```

## Social Media

```yaml
id:
  type: uuid

username:
  type: string
  faker: internet.username

displayName:
  type: string
  faker: person.fullName

bio:
  type: string
  faker: person.bio

avatar:
  type: string
  faker: image.avatar

followers:
  type: number
  min: 0
  max: 100000

verified:
  type: boolean
```

## Task Manager

```txt
GET /tasks:
  id:uuid
  title:string
  completed:boolean
  assignee:name
  dueDate:date

GET /projects:
  id:uuid
  name:string
  owner:name
  createdAt:date
```
