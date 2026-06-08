<template>
  <div class="canvas">
    <img src="/mannequin.png" class="mannequin" />

    <img
      v-if="outfitStore.dress"
      :src="outfitStore.dress.image_path"
      class="dress"
    />

    <img
      v-if="outfitStore.shoe"
      :src="outfitStore.shoe.image_path"
      class="shoe"
    />

    <img
      v-if="outfitStore.accessory"
      :src="outfitStore.accessory.image_path"
      class="accessory"
    />
  </div>
</template>

<script setup lang="ts">
import { useOutfitStore } from "~/stores/outfit";
import { onMounted, onUnmounted } from "vue";

onMounted(() => {
  document.body.style.backgroundImage = "none";
  document.body.style.backgroundColor = "white";
});

onUnmounted(() => {
  document.body.style.backgroundImage = "";
  document.body.style.backgroundColor = "";
});

const outfitStore = useOutfitStore();
</script>

<style>
body {
  width: 100%;
  height: 100vh;
  background-color: white;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 0;
}
</style>