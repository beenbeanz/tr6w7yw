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

    <div ref="scrollWrap" class="pieces-scroll-wrapper">
      <div class="pieces-grid">
        <div
          v-for="piece in activePieces"
          :key="piece.id"
          class="piece-card"
          @click="displayOnScreen(activeCategory, piece)"
        >
          <img :src="piece.image_path" :alt="piece.display_name" />
        </div>
      </div>
    </div>
  </div>

  <div class="mannequinContainer">
    <img
      src="/mannequin.png"
      alt="bare mannequin"
      style="
        position: absolute;
        top: 62%;
        left: 70%;
        transform: translate(-50%, -50%);
        width: 633px;
        height: auto;
        z-index: 1;
        
      "
    />
    <img
      v-if="selectedDress"
      :src="selectedDress.image_path"
      :alt="selectedDress.display_name"
      class="dressOverlay"
      :style="getDressStyle()"
    />
    <img
      v-if="selectedShoe"
      :src="selectedShoe.image_path"
      :alt="selectedShoe.display_name"
      class="shoeOverlay"
      :style="getShoeStyle()"
    />
    <img
      v-if="selectedAccessories"
      :src="selectedAccessories.image_path"
      :alt="selectedAccessories.display_name"
      class="accessoriesOverlay"
      :style="getAccessoriesStyle()"
    />
  </div>
  <div class="button-container">
    <button class="button restart-btn" @click="restartOutfit">Restart</button>
    <a class="button" @click.prevent="handleNavigate">Finish & Share</a>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";
import type { CSSProperties } from "vue";
import gsap from "gsap";
import { supabase } from "~/utils/supabase";
import { useRouter } from "vue-router";
import { useOutfitStore } from "~/stores/outfit";

const outfitStore = useOutfitStore();

const router = useRouter();
const isLeaving = ref(false);

let prevBodyBg = '';
let prevBodyBgColor = '';

async function handleNavigate() {
  isLeaving.value = true;
  await new Promise((resolve) => setTimeout(resolve, 1200));
  router.push("/share");
}

function restartOutfit() {
  selectedDress.value = null;
  selectedShoe.value = null;
  selectedAccessories.value = null;
  outfitStore.dress = null;
  outfitStore.shoe = null;
  outfitStore.accessory = null;
}

const activeCategory = ref("dress");
const tabs = [
  { label: "Dress", value: "dress" },
  { label: "Shoes", value: "shoe" },
  { label: "Accessories", value: "accessories" },
];

const dressPieces = ref<any[]>([]);
const shoePieces = ref<any[]>([]);
const accessoriesPieces = ref<any[]>([]);

const { data: dressData } = await supabase.from("dress_pieces").select("*");
dressPieces.value = (dressData ?? []).map((piece) => ({
  ...piece,
  image_path: supabase.storage
    .from("dress_pieces")
    .getPublicUrl(piece.image_path).data.publicUrl,
}));

const { data: shoeData } = await supabase.from("shoe_pieces").select("*");
shoePieces.value = (shoeData ?? []).map((piece) => ({
  ...piece,
  image_path: supabase.storage
    .from("shoe-pieces")
    .getPublicUrl(piece.image_path).data.publicUrl,
}));

const { data: accessoriesData } = await supabase
  .from("accessories_pieces")
  .select("*");
accessoriesPieces.value = (accessoriesData ?? []).map((piece) => ({
  ...piece,
  image_path: supabase.storage
    .from("acessories-pieces")
    .getPublicUrl(piece.image_path).data.publicUrl,
}));

const selectedDress = ref<any>(null);
const selectedShoe = ref<any>(null);
const selectedAccessories = ref<any>(null);

const activePieces = computed(() => {
  if (activeCategory.value === "dress") return dressPieces.value;
  if (activeCategory.value === "shoe") return shoePieces.value;
  if (activeCategory.value === "accessories") return accessoriesPieces.value;
  return [];
});

function getDressStyle(): CSSProperties {
  if (!selectedDress.value) return {};
  const { 
    width = 615, 
    height = "auto", 
    rotation = 0,
    layer_order = 1,
    translate_x = -30,
    translate_y = -50
  } = selectedDress.value;
  
  return {
    position: "absolute",
    top: "70%",
    left: "70%",
    transform: `translate(${translate_x}%, ${translate_y}%) rotate(${rotation}deg)`,
    width: `${width}px`,
    height: height,
    zIndex: layer_order as unknown as string,
  } as CSSProperties;
}

function getShoeStyle(): CSSProperties {
  if (!selectedShoe.value) return {};
  const { 
    width = 677, 
    height = "auto", 
    rotation = 0,
    layer_order = 1,
    translate_x = -45,
    translate_y = -7
  } = selectedShoe.value;
  
  return {
    position: "absolute",
    top: "70%",
    left: "70%",
    transform: `translate(${translate_x}%, ${translate_y}%) rotate(${rotation}deg)`,
    width: `${width}px`,
    height: height,
    zIndex: layer_order as unknown as string,
  } as CSSProperties;
}

function getAccessoriesStyle(): CSSProperties {
  if (!selectedAccessories.value) return {};
  const { 
    width = 200, 
    height = "auto", 
    rotation = 0,
    layer_order = 3,
    translate_x = -120,
    translate_y = -50
  } = selectedAccessories.value;
  
  return {
    position: "absolute",
    top: "30%",
    left: "70%",
    transform: `translate(${translate_x}%, ${translate_y}%) rotate(${rotation}deg)`,
    width: `${width}px`,
    height: height,
    zIndex: layer_order as unknown as string,
  } as CSSProperties;
}

const scrollWrap = ref<HTMLElement | null>(null);
let targetScroll = 0;
let maxScroll = 0;

function updateMax() {
  const el = scrollWrap.value;
  if (!el) return;
  maxScroll = Math.max(0, el.scrollHeight - el.clientHeight);
  targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));
}

function onWheel(e: WheelEvent) {
  const el = scrollWrap.value;
  if (!el) return;
  e.preventDefault();
  updateMax();
  const delta = e.deltaY;
  targetScroll = Math.max(0, Math.min(maxScroll, el.scrollTop + delta));
  gsap.to(el, {
    scrollTop: targetScroll,
    duration: 0.6,
    ease: "power3.out",
    overwrite: true,
  });
}

onMounted(() => {
  const computedStyle = window.getComputedStyle(document.body);
  prevBodyBg = computedStyle.backgroundImage || '';
  prevBodyBgColor = computedStyle.backgroundColor || '';
  
  document.body.style.backgroundImage = 'url("/insideBg.png")';
  document.body.style.backgroundColor = '';
  
  const el = scrollWrap.value;
  if (!el) return;
  nextTick(() => updateMax());
  el.addEventListener("wheel", onWheel, { passive: false });
  window.addEventListener("resize", updateMax);
});

onUnmounted(() => {
  document.body.style.backgroundImage = prevBodyBg;
  document.body.style.backgroundColor = prevBodyBgColor;
  
  const el = scrollWrap.value;
  if (el) el.removeEventListener("wheel", onWheel);
  window.removeEventListener("resize", updateMax);
});

function displayOnScreen(type: string, piece: any) {
  if (type === "dress") {
    selectedDress.value = piece;
    outfitStore.dress = piece;
  }

  if (type === "shoe") {
    selectedShoe.value = piece;
    outfitStore.shoe = piece;
  }

  if (type === "accessories") {
    selectedAccessories.value = piece;
    outfitStore.accessory = piece;
  }
}
</script>

<style>
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
.logo-container {
  animation: fadeUp 0.8s ease both;
}

.box {
  animation: fadeUp 0.8s ease 0.2s both;
}

.button-container {
  position: fixed;
  bottom: 40px;
  right: 40px;
  display: flex;
  gap: 12px;
  animation: fadeUp 0.8s ease 0.6s both;
}

.button {
  background: #c8953a;
  color: white;
  padding: 16px 32px;
  border-radius: 8px;
  cursor: pointer;
  z-index: 9999;
  display: inline-block;
  border: none;
  font-family: var(--sans);
  font-size: 1rem;
  transition: background 0.2s;
}

.button:hover {
  background: #b8852a;
}

.restart-btn {
  background: #6b3a75;
}

.restart-btn:hover {
  background: #5a2d63;
}

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
  transition:
    transform 0.3s ease,
    background 0.3s;
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

.pieces-scroll-wrapper {
  flex: 1;
  position: relative;
  overflow-y: auto; /* allow native scrolling; we'll smooth via GSAP */
  -webkit-overflow-scrolling: touch;
}
.pieces-scroll-wrapper::-webkit-scrollbar {
  display: none;
}

.pieces-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  flex: 1;
  align-content: flex-start;
  position: relative;
  will-change: transform;
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
  background: rgba(255, 255, 255, 0.1);
}
.finishButton {
  width: 500px;
  height: 500px;
}
</style>
