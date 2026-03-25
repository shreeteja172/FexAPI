# React + FexAPI

Use FexAPI as your mock backend during React development.

## Setup

```bash
npx fexapi init
```

Edit `fexapi/schema.fexapi`:

```txt
port: 4000

GET /users:
  id:uuid
  name:name
  email:email
  avatar:url
```

```bash
npx fexapi generate
npx fexapi dev --watch
```

## Enable CORS

Your React dev server runs on `localhost:3000` (or `5173` with Vite), so enable CORS:

```js
module.exports = {
  port: 4000,
  cors: true,
}
```

## Fetching Data

```jsx
import { useState, useEffect } from 'react'

function UserList() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:4000/users?count=10')
      .then(res => res.json())
      .then(data => {
        setUsers(data.users)
        setLoading(false)
      })
  }, [])

  if (loading) return <p>Loading...</p>

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>
          {user.name} — {user.email}
        </li>
      ))}
    </ul>
  )
}
```

## With React Query

```jsx
import { useQuery } from '@tanstack/react-query'

function UserList() {
  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () =>
      fetch('http://localhost:4000/users?count=10')
        .then(res => res.json())
        .then(data => data.users),
  })

  if (isLoading) return <p>Loading...</p>

  return (
    <ul>
      {data.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
```

## Package Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "mock": "fexapi dev --watch --log",
    "dev:full": "concurrently \"npm run dev\" \"npm run mock\""
  }
}
```

Use [`concurrently`](https://www.npmjs.com/package/concurrently) to run both your React app and FexAPI simultaneously.
