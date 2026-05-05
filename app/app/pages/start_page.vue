<template>
  <div class="page-wrapper">
    <div class="logo-container">
      <img src="/logo.png" alt="triple t logo" class="logo" />
    </div>
    <h1 class="title">Magical Dress Up Game</h1>
    <NuxtLink to="/dress_up" class="button">
      <button class="border-2">Play Now</button>
    </NuxtLink>
  </div>
</template>

<style>
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

.page-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 2rem 1rem;
}

.logo-container {
  display: flex;
  justify-content: center;
  width: 100%;
}

.logo {
  width: clamp(100px, 18.75vw, 250px); /* scales with screen size */
  height: auto; /* keeps aspect ratio */
}

.title {
  text-align: center;
  font-size: clamp(2rem, 8vw, 80px); /* responsive font too */
  padding-top: 2rem;
}

.button {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}
</style>