<template>
  <navbar />
  <NuxtPage />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import navbar from '@/components/nav_bar.vue'

const authStore = useAuthStore()

onMounted(() => {
  authStore.fetchUser()
})

onMounted(() => {
  const audio = new Audio('/yourfile.mp3')
  audio.loop = true
  audio.volume = 0.5
  audio.play()
})

</script>

