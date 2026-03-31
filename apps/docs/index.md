---
layout: home
title: FexAPI
---

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vitepress'

const router = useRouter()

onMounted(() => {
  router.go('/getting-started/introduction')
})
</script>
