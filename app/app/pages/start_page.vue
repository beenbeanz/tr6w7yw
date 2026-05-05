<template>
  <div class="page">
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

.logo-container {
  display: flex;
  justify-content: center;
  width: 100%;
  padding-top: 10rem;
  padding-bottom: -10px;
}

.logo {
  width: clamp(100px, 18.75vw, 250px); 
  height: auto; 
}

.title {
  text-align: center;
  font-size: clamp(2rem, 8vw, 80px);
  padding-top: 0;
  margin-top: -5rem;
}

.button {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  border-radius: 20px;
  border-width: 10px;
  
}
</style>