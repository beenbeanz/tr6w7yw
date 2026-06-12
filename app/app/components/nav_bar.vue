<template>
  <nav class="navbar">
    <button class="profile-btn" @click="goToProfile">
      Profile
    </button>
  </nav>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

function goToProfile() {
  router.push("/user_account");
}
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 100;
  animation: fadeUp 0.8s ease both;
}

.profile-btn {
  font-family: var(--sans);
  font-size: 1rem;
  font-weight: 500;
  color: var(--navy2);

  padding: 0.75rem 1.5rem;

  border: 2px solid rgba(255, 255, 255, 0.25);
  border-radius: 12px;

  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);

  cursor: pointer;

  box-shadow:
    0 4px 15px rgba(107, 30, 78, 0.2),
    0 0 10px rgba(143, 51, 94, 0.2);

  animation: borderGlow 2.5s ease-in-out infinite;
  transition:
    transform 0.2s ease,
    background-color 0.2s ease,
    color 0.2s ease,
    box-shadow 0.2s ease;
}

.profile-btn:hover {
  background: var(--coral);
  color: var(--gold);
  transform: translateY(-2px) scale(1.05);

  box-shadow:
    0 6px 20px rgba(107, 30, 78, 0.35),
    0 0 20px rgba(143, 51, 94, 0.5);
}

.profile-btn:active {
  transform: scale(0.96);
}
</style>