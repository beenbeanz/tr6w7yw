<template>
  <nav>
    <div>Logo</div>
    <div v-if="authStore.isLoggedIn">
      <button @click="goToProfile">👤 Profile</button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '#imports'

const router = useRouter()
const authStore = useAuthStore()

const goToProfile = () => {
  router.push('/profile')
}
</script>