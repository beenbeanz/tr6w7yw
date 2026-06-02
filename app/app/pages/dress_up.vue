<template>
  <div class="logo-container">
    <img src="/logo.png" alt="triple t logo" class="logo" />
  </div>

  <div class="box">
    <div class="category-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        :class="['tab-btn', { active: activeCategory === tab.value }]"
        @click="activeCategory = tab.value"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="pieces-grid">
      <div v-for="piece in activePieces" :key="piece.id" class="piece-card" @click="displayOnScreen(activeCategory, piece)">
        <img :src="piece.image_path" :alt="piece.display_name" />
      </div>
    </div>
  </div>
  
  <div class="mannequinContainer">
    <img src="/mannequin.png" alt="bare mannequin" style="position: absolute; top: 70%; left: 70%; transform: translate(-50%, -50%); width: 677px; height: auto; z-index: 1;" />
    <img v-if="selectedDress" :src="selectedDress.image_path" :alt="selectedDress.display_name" class="dressOverlay" style="position: absolute; top: 70%; left: 70%; transform: translate(-50%, -50%); width: 677px; height: auto; z-index: 2;" />
    <img v-if="selectedShoe" :src="selectedShoe.image_path" :alt="selectedShoe.display_name" class="shoeOverlay" style="position: absolute; top: 70%; left: 70%; transform: translate(-50%, -50%); width: 677px; height: auto; z-index: 1;" />
    <img v-if="selectedAccessories" :src="selectedAccessories.image_path" :alt="selectedAccessories.display_name" class="accessoriesOverlay" style="position: absolute; top: 70%; left: 70%; transform: translate(-50%, -50%); width: 677px; height: auto; z-index: 3;" />
  </div>
</template>


<script setup lang="ts">
  import { ref } from 'vue'  
  import { supabase } from '~/utils/supabase'

  const activeCategory = ref('dress')
  const tabs = [
    { label: 'Dress', value: 'dress' },
    { label: 'Shoes', value: 'shoe' },
    { label: 'Accessories', value: 'accessories' }
  ]

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

  const activePieces = computed(() => {
    if (activeCategory.value === 'dress') return dressPieces.value
    if (activeCategory.value === 'shoe') return shoePieces.value
    if (activeCategory.value === 'accessories') return accessoriesPieces.value
    return []
  })

  function displayOnScreen(type: string, piece: any) {
    console.log('Clicked piece:', type, piece)
    if (type === 'dress') selectedDress.value = piece
    if (type === 'shoe') selectedShoe.value = piece
    if (type === 'accessories') selectedAccessories.value = piece
  }
</script>

<style>
.dress-overlay,
.shoe-overlay,
.accessories-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 1000px;
  height: 1000px;
  object-fit: contain;
  pointer-events: none;
  z-index: 10;
}
:root {
  --navy: #6b3a75;
  --navy2: #2d1a42;
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
.logo-container {
  height: 0px;
}
.logo {
  width: clamp(100px, 18.75vw, 250px);
  height: auto;
  animation:
    fadeIn 1s ease both,
    float 4s ease-in-out 1s infinite;
    margin-left: 1290px;
    padding-top: 150px;
}
.category-tabs {
  display: flex;
  gap: 10px;
  width: 100%;
  margin-bottom: 8px;
}

.tab-btn {
  flex: 1;
  padding: 10px 0;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.2);
  color: var(--cream);
  font-family: var(--sans);
  font-size: 0.875rem;
  cursor: pointer;
  transition:
    background 0.2s,
    border-color 0.2s;
}

.tab-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.tab-btn.active {
  background: var(--navy2);
  border-color: var(--navy2);
  color: var(--cream);
  font-weight: 550;
}

.piece-card {
  width: 200px;
  height: 200px;
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
  margin: 12px;
  width: 675px;
  height: 980px;
  background-color: rgb(from var(--navy) r g b / 0.75);
  transition:
    background-color 0.2s,
    color 0.2s,
    transform 0.15s;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  overflow: hidden;
  border-radius: 8px;
}

.pieces-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  overflow-y: auto;
  flex: 1;
  align-content: flex-start;
}
.pieces-grid::-webkit-scrollbar {
  display: none;
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