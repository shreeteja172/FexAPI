# Vue + FexAPI

Use FexAPI as your mock backend during Vue development.

## Setup

::: code-group

```bash [npm]
npx fexapi@latest init
```

```bash [pnpm]
pnpm dlx fexapi@latest init
```

```bash [bun]
bunx fexapi@latest init
```

```bash [yarn]
yarn dlx fexapi@latest init
```

:::

Edit `fexapi/schema.fexapi`:

```txt
port: 4000

GET /users:
  id:uuid
  name:name
  email:email
```

::: code-group

```bash [npm]
npx fexapi@latest generate
npx fexapi@latest dev --watch
```

```bash [pnpm]
pnpm dlx fexapi@latest generate
pnpm dlx fexapi@latest dev --watch
```

```bash [bun]
bunx fexapi@latest generate
bunx fexapi@latest dev --watch
```

```bash [yarn]
yarn dlx fexapi@latest generate
yarn dlx fexapi@latest dev --watch
```

:::

Enable CORS in `fexapi.config.js`:

```js
module.exports = {
  port: 4000,
  cors: true,
};
```

## Composition API

```vue
<script setup>
import { ref, onMounted } from "vue";

const users = ref([]);
const loading = ref(true);

onMounted(async () => {
  const res = await fetch("http://localhost:4000/users?count=10");
  const data = await res.json();
  users.value = data.users;
  loading.value = false;
});
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
