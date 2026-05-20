<template>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" />
  <link
    href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=IBM+Plex+Mono:wght@400;500&family=Sora:wght@300;400;500;600&display=swap"
    rel="stylesheet"
  />
  <link
    href="https://fonts.googleapis.com/css2?family=Emilys+Candy&display=swap"
    rel="stylesheet"
  />
  <div class="page" :class="{ 'fade-out': isLeaving }">
    <div class="bg-overlay" :class="{ 'bg-transition': isLeaving }"></div>
    <div class="content">
      <div class="logo-container">
        <img src="/logo.png" alt="triple t logo" class="logo" />
      </div>
      <h1 class="title">Magical Dress Up Game</h1>
      <a class="button-link" @click.prevent="handleNavigate">Play Now</a>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const isLeaving = ref(false);

async function handleNavigate() {
  isLeaving.value = true;
  await new Promise((resolve) => setTimeout(resolve, 1200));
  router.push("/dress_up");
}
</script>

<style>
:root {
  --navy: #6b3a75;
  --navy2: #1a2d42;
  --navy3: #243650;
  --cream: #f9f6ef;
  --cream2: #f0ebe0;
  --gold: #c8953a;
  --gold-light: #f0c97a;
  --teal: #2a8c7e;
  --teal-light: #e0f2ef;
  --red: #c0392b;
  --red-light: #fdecea;
  --green: #2e7d32;
  --green-light: #e8f5e9;
  --blue: #1565c0;
  --blue-light: #e3f0fc;
  --text: #1a1a18;
  --muted: #5a5a55;
  --border: #d8d3c8;
  --mono: "IBM Plex Mono", monospace;
  --serif: "DM Serif Display", serif;
  --sans: "Sora", sans-serif;
  --candy: "Emilys Candy", serif; 
}

.page {
  position: relative;
  width: 100%;
  min-height: 100vh;
}

.bg-overlay {
  position: fixed;
  inset: 0;
  background-image: url("/insideBg.png");
  background-size: cover;
  background-position: center;
  opacity: 0;
  transition: opacity 1s ease 0.4s;
  z-index: 0;
}

.bg-overlay.bg-transition {
  opacity: 1;
}

.content {
  position: relative;
  z-index: 1;
}

.page.fade-out .content {
  animation: fadeOut 0.6s ease forwards;
}

@keyframes fadeOut {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-16px);
  }
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  width: 100%;
  min-height: 100vh;
  background-image: url("/bg0.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  80% {
    transform: translateY(-10px);
  }
}

@keyframes borderGlow {
  0%,
  100% {
    box-shadow: 0 0 6px rgba(71, 6, 133, 0.3);
  }
  80% {
    box-shadow: 0 0 18px rgba(160, 58, 200, 0.7);
  }
}

.logo {
  width: clamp(100px, 18.75vw, 250px);
  height: auto;
  animation:
    fadeIn 1s ease both,
    float 4s ease-in-out 1s infinite;
}

.title {
  font-family: var(--candy);
  font-weight: 400;
  line-height: 1.2;
  text-align: center;
  font-size: clamp(2rem, 8vw, 80px);
  margin-top: 6rem;
  border-radius: 8px;
  padding: 0.5rem 1.5rem;
  animation:
    fadeUp 0.8s ease 0.3s both,
    shimmer 3s ease-in-out 1.2s infinite;
  color: #8f335e;
  text-shadow:
    0 2px 4px rgba(83, 30, 107, 0.8),
    0 0 20px rgba(86, 23, 117, 0.5);
}

.button-link {
  font-family: var(--sans);
  font-size: 1rem;
  font-weight: 500;
  color: var(--navy);
  backdrop-filter: blur(6px);
  border-radius: 8px;
  padding: 0.75rem 2rem;
  text-decoration: none;
  display: block;
  width: fit-content;
  margin: 2rem auto 0;
  animation:
    fadeUp 0.8s ease 0.7s both,
    borderGlow 2.5s ease-in-out 1.5s infinite;
  transition:
    background-color 0.2s,
    color 0.2s,
    transform 0.15s;
}

.button-link:hover {
  background-color: var(--navy);
  color: var(--gold);
  transform: scale(1.05);
}

.button-link:active {
  transform: scale(0.97);
}
</style>