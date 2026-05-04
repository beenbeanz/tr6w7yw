<template>
    <h1 class="text-3xl font-bold underline">Magical Dress Up Game</h1>
    
    <NuxtLink to="/dress_up" class="relative z-50">
     <button class="relative z-50 border-b border-2">Click Me</button>
    </NuxtLink>

    <div class="fixed inset-0 m-0 p-0">
        <img src="/logo.png" alt="triple t logo" class="absolute bottom-0 left-0 w-57 h-70 z-10">
    </div>
</template>

<script setup lang="ts">

</script>

<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
body {
    width: 100%;
    height: 100vh;
    background-image: url('/bg0.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    z-index: 0;
}
</style>
