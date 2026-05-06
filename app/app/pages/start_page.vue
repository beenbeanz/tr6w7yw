<template>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" />
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=IBM+Plex+Mono:wght@400;500&family=Sora:wght@300;400;500;600&display=swap" rel="stylesheet" />
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
:root {
  --navy: #0d1b2a;
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
  font-family: var(--serif);
  font-weight: 400;
  line-height: 1.2;
  color: var(--navy);
  text-align: center;
  font-size: clamp(2rem, 8vw, 80px);
  padding-top: 0;
  margin-top: -5rem;
}

.button {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  
}
</style>