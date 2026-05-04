<template>
  <div class="logo fixed inset-0 m-0 p-0">
    <img
      src="/logo.png"
      alt="triple t logo"
      class="absolute bottom-0 left-0 w-57 h-70 z-10"
    />
  </div>
  <h1 class="title text-3xl font-bold underline">Magical Dress Up Game</h1>

  <NuxtLink to="/dress_up" class="relative z-50">
    <button class="button relative z-50 border-b border-2">Play Now</button>
  </NuxtLink>
</template>

<script setup lang="ts"></script>

<style>
.logo {
    border-radius: 9px;
    border-color: red;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  width: 100%;
  height: 100vh;
  background-image: url("/bg0.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 0;
}
</style>
