<template>
  <div>
    <div class="theme-island" role="toolbar" aria-label="Select background theme">
      <div class="theme-list">
        <button
          v-for="t in themes"
          :key="t"
          :class="['theme-thumb', { selected: t === selectedTheme } ]"
          @click="selectTheme(t)"
          :aria-pressed="t === selectedTheme"
        >
          <img :src="`/bg${t}.png`" :alt="`Theme ${t}`" @error="(e)=>{ (e.target as HTMLImageElement).src = `/bg${t}.jpg`; }" />
        </button>
      </div>
    </div>

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

    <div class="controls">
      <button class="btn" @click="downloadJPEG" :disabled="capturing">{{ capturing ? 'Preparing...' : 'Download JPEG' }}</button>
      <button class="btn" @click="shareJPEG" :disabled="capturing">{{ capturing ? 'Preparing...' : 'Share' }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useOutfitStore } from "~/stores/outfit";
import { ref, onMounted, onUnmounted, watch } from "vue";

const outfitStore = useOutfitStore();
const capturing = ref(false);

// Theme list indices (public/bg0..bg10 with mixed png/jpg)
const themes = Array.from({ length: 11 }, (_, i) => i);
const selectedTheme = ref(0);
let prevBodyBg = '';
let prevBodyBgColor = '';

function applyBodyBackground(index: number) {
  const png = `/bg${index}.png`;
  const jpg = `/bg${index}.jpg`;
  // probe png first, then fallback to jpg
  const probe = new Image();
  probe.onload = () => {
    document.body.style.backgroundImage = `url('${png}')`;
  };
  probe.onerror = () => {
    document.body.style.backgroundImage = `url('${jpg}')`;
  };
  probe.src = png;
  document.body.style.backgroundColor = '';
}

function selectTheme(i: number) {
  selectedTheme.value = i;
}

onMounted(() => {
  // preserve previous body background to restore on unmount
  prevBodyBg = document.body.style.backgroundImage || '';
  prevBodyBgColor = document.body.style.backgroundColor || '';
  applyBodyBackground(selectedTheme.value);
});

onUnmounted(() => {
  // restore
  document.body.style.backgroundImage = prevBodyBg;
  document.body.style.backgroundColor = prevBodyBgColor;
});

watch(selectedTheme, (v) => applyBodyBackground(v));

async function capturePageAsBlob(): Promise<Blob> {
  const html2canvas = (await import('html2canvas')).default;
  const docEl = document.documentElement;
  const width = Math.max(docEl.scrollWidth, docEl.clientWidth);
  const height = Math.max(docEl.scrollHeight, docEl.clientHeight);
  const scale = Math.min(2, window.devicePixelRatio || 1);

  const canvas = await html2canvas(document.body, {
    width,
    height,
    windowWidth: width,
    windowHeight: height,
    scrollX: -window.scrollX,
    scrollY: -window.scrollY,
    scale,
    useCORS: true,
    allowTaint: false,
  });

  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b: Blob | null) => {
      if (b) resolve(b);
      else reject(new Error('Failed to create blob from canvas'));
    }, 'image/jpeg', 0.92);
  });
}

async function downloadJPEG() {
  capturing.value = true;
  try {
    const blob = await capturePageAsBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `outfit-${Date.now()}.jpg`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } finally {
    capturing.value = false;
  }
}

async function shareJPEG() {
  if ((navigator as any).share && typeof (navigator as any).canShare === 'function') {
    capturing.value = true;
    try {
      const blob = await capturePageAsBlob();
      const file = new File([blob], `outfit-${Date.now()}.jpg`, { type: 'image/jpeg' });
      if ((navigator as any).canShare({ files: [file] })) {
        await (navigator as any).share({ files: [file], title: 'My outfit' });
        return;
      }
    } catch (e) {
    } finally {
      capturing.value = false;
    }
  }
  await downloadJPEG();
}
</script>

<style>
.canvas {
  position: relative;
}
.canvas {
  width: 100%;
  min-height: 100vh;
}
.mannequin {
  position: absolute;
  top: 62%;
  left: 70%;
  transform: translate(-50%, -50%);
  width: 633px;
  height: auto;
  z-index: 1;
}
.dress {
  position: absolute;
  top: 70%;
  left: 73.5%;
  transform: translate(-60%, -80%);
  width: 500px;
  height: auto;
  z-index: 2;
  pointer-events: none;
}
.shoe {
  position: absolute;
  top: 70%;
  left: 70%;
  transform: translate(-50%, -50%);
  width: 677px;
  height: auto;
  z-index: 1;
  pointer-events: none;
}
.accessory {
  position: absolute;
  top: 70%;
  left: 70%;
  transform: translate(-50%, -50%);
  width: 677px;
  height: auto;
  z-index: 3;
  pointer-events: none;
}
.controls {
  position: fixed;
  bottom: 40px;
  right: 40px;
  display: flex;
  gap: 8px;
  z-index: 9999;
}
.btn {
  background: #c8953a;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0,0,0,0.15);
}
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
/* page body default - theme applied via inline style from component */
body {
  width: 100%;
  min-height: 100vh;
  background-color: transparent;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 0;
}

/* Theme island */
.theme-island {
  position: fixed;
  top: 14px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10000;
  background: rgba(255,255,255,0.06);
  padding: 8px;
  border-radius: 12px;
  backdrop-filter: blur(6px);
}
.theme-list { display:flex; gap:8px; align-items:center; }
.theme-thumb { border: 2px solid transparent; padding: 2px; background: transparent; border-radius:6px; }
.theme-thumb img { width:48px; height:32px; object-fit:cover; display:block; border-radius:4px; }
.theme-thumb.selected { border-color: #c8953a; box-shadow: 0 4px 10px rgba(0,0,0,0.12); }

</style>