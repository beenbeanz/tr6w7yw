<template>
  <div class="box">

   <div v-for="piece in dressPieces" :key="piece.id" class="piece-card" v-on:click="displayOnScreen('dress', piece)">
      <img :src="piece.image_path" :alt="piece.display_name" />
    </div>

    <div v-for="piece in shoePieces" :key="piece.id" class="piece-card" v-on:click="displayOnScreen('shoe', piece)">
      <img :src="piece.image_path" :alt="piece.display_name" />
    </div>

    <div v-for="piece in accessoriesPieces" :key="piece.id" class="piece-card" v-on:click="displayOnScreen('accessories', piece)">
      <img :src="piece.image_path" :alt="piece.display_name" />
    </div>

  </div>
  
  <img src="/mannequin.png" alt="bare mannequin" style="position: absolute; top: 70%; left: 70%; transform: translate(-50%, -50%); width: 677px; height: auto; z-index: 1;" />

</template>

<script setup lang="ts">
  import { supabase } from '~/utils/supabase'

  const dressPieces = ref<any[]>([])
  const shoePieces = ref<any[]>([])
  const accessoriesPieces = ref<any[]>([])

  const { data: dressData } = await supabase
    .from('dress_pieces') 
    .select('*')
  dressPieces.value = (dressData ?? []).map(piece => ({
    ...piece,
    image_path: supabase.storage
      .from('dress_pieces')  
      .getPublicUrl(piece.image_path).data.publicUrl
  }))  

  const { data: shoeData } = await supabase
    .from('shoe_pieces') 
    .select('*')
  shoePieces.value = (shoeData ?? []).map(piece => ({
    ...piece,
    image_path: supabase.storage
      .from('shoe-pieces')  
      .getPublicUrl(piece.image_path).data.publicUrl
  }))  

  const { data: accessoriesData } = await supabase
    .from('accessories_pieces') 
    .select('*')
  accessoriesPieces.value = (accessoriesData ?? []).map(piece => ({
    ...piece,
    image_path: supabase.storage
      .from('acessories-pieces')  
      .getPublicUrl(piece.image_path).data.publicUrl
  }))  

  const selectedDress = ref<any>(null)
  const selectedShoe = ref<any>(null)
  const selectedAccessories = ref<any>(null)

  function displayOnScreen(type: string, piece: any) {
    if (type === 'dress') selectedDress.value = piece
    if (type === 'shoe') selectedShoe.value = piece
    if (type === 'accessories') selectedAccessories.value = piece
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
}
html {
  overflow: hidden;
}
.piece-card {
  width: 192px;
  height: 192px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.piece-card img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.box {
  margin: 20px;
  width: 800px;
  height: 950px;
  background-color: rgb(from var(--navy) r g b / 0.8);
  animation:
    fadeUp 0.8s ease 0.7s both,
    borderGlow 2.5s ease-in-out 1.5s infinite;
  transition:
    background-color 0.2s,
    color 0.2s,
    transform 0.15s;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 20px;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  width: 100%;
  height: 100vh;
  background-image: url("/insideBg.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 0;
}
.piece-card:hover {
  transform: scale(1.05);
  cursor: pointer;
}
</style>