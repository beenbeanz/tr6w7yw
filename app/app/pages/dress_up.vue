<template>
  <div class="box">
    <img 
        v-for="piece in dressPieces" 
        :key="piece.id"
        :src="piece.image_path"
        :alt="piece.display_name"
        class="w-48 h-48"
    />

    <img 
        v-for="piece in shoePieces" 
        :key="piece.id"
        :src="piece.image_path"
        :alt="piece.display_name"
        class="w-48 h-48"
    />

    <img 
        v-for="piece in accessoriesPieces" 
        :key="piece.id"
        :src="piece.image_path"
        :alt="piece.display_name"
        class="w-48 h-48"
    />
  </div>
</template>

<script setup lang="ts">
import { supabase } from '~/utils/supabase'

  const dressPieces = ref<any[]>([])

  const { data: dressData } = await supabase
      .from('dress_pieces') 
      .select('*')

  dressPieces.value = (dressData ?? []).map(piece => ({
      ...piece,
      image_path: supabase.storage
          .from('dress_pieces')  
          .getPublicUrl(piece.image_path).data.publicUrl
  }))  



  const shoePieces = ref<any[]>([])

  const { data: shoeData } = await supabase
      .from('shoe_pieces') 
      .select('*')
    

  shoePieces.value = (shoeData ?? []).map(piece => ({
      ...piece,
      image_path: supabase.storage
          .from('shoe_pieces')  
          .getPublicUrl(piece.image_path).data.publicUrl
  }))  


  const accessoriesPieces = ref<any[]>([])

  const { data: accessoriesData } = await supabase
      .from('accessories_pieces') 
      .select('*')
    
  console.log(accessoriesData)

  accessoriesPieces.value = (accessoriesData ?? []).map(piece => ({
      ...piece,
      image_path: supabase.storage
          .from('accessories_pieces')  
          .getPublicUrl(piece.image_path).data.publicUrl
  }))  
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
</style>
