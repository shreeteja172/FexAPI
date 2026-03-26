<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vitepress'

const router = useRouter()

onMounted(() => {
	router.go('/getting-started/introduction')
})
</script>

# Redirecting to Getting Started

If the page does not redirect automatically, open [Getting Started](./getting-started/introduction.md).
