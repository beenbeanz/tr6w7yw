<template>
  <nav>
    <div>Logo</div>
    <div>
      <button @click="goToProfile">👤 Profile</button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '#imports'

const router = useRouter()
const authStore = useAuthStore()

function goToProfile() {
  router.push('/user_account')
}
</script>