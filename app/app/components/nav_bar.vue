<template>
  <nav>
    <div>
      <button @click="goToProfile">👤 Profile</button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goToProfile() {
  router.push('/user_account')
}
</script>