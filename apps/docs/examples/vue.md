# Vue + FexAPI

Use FexAPI as your mock backend during Vue development.

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
```

```bash
npx fexapi generate
npx fexapi dev --watch
```

Enable CORS in `fexapi.config.js`:

```js
module.exports = {
  port: 4000,
  cors: true,
}
```

## Composition API

```vue
<script setup>
import { ref, onMounted } from 'vue'

const users = ref([])
const loading = ref(true)

onMounted(async () => {
  const res = await fetch('http://localhost:4000/users?count=10')
  const data = await res.json()
  users.value = data.users
  loading.value = false
})
</script>

<template>
  <p v-if="loading">Loading...</p>
  <ul v-else>
    <li v-for="user in users" :key="user.id">
      {{ user.name }} — {{ user.email }}
    </li>
  </ul>
</template>
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
