<template>
  <div>
    <div class="theme-island" role="toolbar" aria-label="Select background theme">
      <div class="theme-list" ref="themeListRef">
        <button
          v-for="t in themes"
          :key="t"
          :class="['theme-thumb', { selected: t === selectedTheme } ]"
          @click="selectTheme(t)"
          :aria-pressed="t === selectedTheme"
        >
          <img :src="`/bg${t}.png`" :alt="`Theme ${t}`" @error="(e)=>{ (e.target as HTMLImageElement).src = `/bg${t}.jpg`; }" />
        </button>
        <div class="selector" :style="selectorStyle"></div>
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

    <div v-if="successMessage" class="message success-message">{{ successMessage }}</div>
    <div v-if="errorMessage" class="message error-message">{{ errorMessage }}</div>

    <div class="controls">
      <button class="btn" @click="downloadJPEG" :disabled="capturing">
        {{ capturing ? 'Preparing...' : 'Download JPEG' }}
      </button>
      <button class="btn" @click="shareJPEG" :disabled="capturing">
        {{ capturing ? 'Preparing...' : 'Share' }}
      </button>
      <button class="btn" @click="openSaveDialog" :disabled="!outfitStore.dress && !outfitStore.shoe && !outfitStore.accessory">
        Save Outfit
      </button>
    </div>

    <div v-if="showSaveDialog" class="save-dialog-overlay" @click="closeSaveDialog">
      <div class="save-dialog" @click.stop>
        <button class="close-btn" @click="closeSaveDialog">✕</button>
        <h3>Save Your Outfit</h3>
        <input
          v-model="outfitNameInput"
          type="text"
          placeholder="Give your outfit a magical name..."
          maxlength="50"
          @keyup.enter="handleSaveOutfit"
        />
        <div class="char-count">{{ outfitNameInput.length }}/50</div>
        <div class="dialog-buttons">
          <button class="btn-cancel" @click="closeSaveDialog">Cancel</button>
          <button
            class="btn-save"
            @click="handleSaveOutfit"
            :disabled="!outfitNameInput.trim() || saving"
          >
            {{ saving ? 'Saving...' : 'Save' }}
          </button>
        </div>
      </div>
    </div>

    <AuthModal
      :is-open="showAuthModal"
      @close="showAuthModal = false"
      @success="handleAuthSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { useOutfitStore } from "~/stores/outfit"
import { useAuthStore } from "#imports"
import { useOutfits } from "@/composables/useOutfits"
import AuthModal from "@/components/AuthModal.vue"
import { ref, onMounted, onUnmounted, watch, nextTick } from "vue"

const outfitStore = useOutfitStore()
const authStore = useAuthStore()
const { saveOutfit, loading: saving, error: saveError } = useOutfits()

const capturing = ref(false)

// Theme list
const themes = Array.from({ length: 11 }, (_, i) => i)
const selectedTheme = ref(0)
const themeListRef = ref<HTMLElement | null>(null)
const selectorStyle = ref<Record<string, string>>({ transform: 'translateX(0px)', width: '0px', height: '0px' })
let prevBodyBg = ''
let prevBodyBgColor = ''

const showSaveDialog = ref(false)
const outfitNameInput = ref('')
const successMessage = ref('')
const errorMessage = ref('')
const showAuthModal = ref(false)

function applyBodyBackground(index: number) {
  const png = `/bg${index}.png`
  const jpg = `/bg${index}.jpg`
  const probe = new Image()
  probe.onload = () => {
    document.body.style.backgroundImage = `url('${png}')`
  }
  probe.onerror = () => {
    document.body.style.backgroundImage = `url('${jpg}')`
  }
  probe.src = png
  document.body.style.backgroundColor = ''
}

function selectTheme(i: number) {
  selectedTheme.value = i
  nextTick(() => updateSelector())
}

onMounted(() => {
  prevBodyBg = document.body.style.backgroundImage || ''
  prevBodyBgColor = document.body.style.backgroundColor || ''
  applyBodyBackground(selectedTheme.value)
  updateSelector()
  window.addEventListener('resize', updateSelector)
  nextTick(() => {
    const imgs = themeListRef.value?.querySelectorAll('img') ?? []
    imgs.forEach((img) => img.addEventListener('load', updateSelector))
  })
})

onUnmounted(() => {
  document.body.style.backgroundImage = prevBodyBg
  document.body.style.backgroundColor = prevBodyBgColor
  window.removeEventListener('resize', updateSelector)
  const imgs = themeListRef.value?.querySelectorAll('img') ?? []
  imgs.forEach((img) => img.removeEventListener('load', updateSelector))
})

watch(selectedTheme, (v) => {
  applyBodyBackground(v)
  nextTick(() => updateSelector())
})

async function updateSelector() {
  await nextTick()
  const container = themeListRef.value
  if (!container) return
  const buttons = container.querySelectorAll('.theme-thumb')
  const idx = selectedTheme.value
  const el = buttons[idx] as HTMLElement | undefined
  if (!el) return
  const containerRect = container.getBoundingClientRect()
  const elRect = el.getBoundingClientRect()
  const left = elRect.left - containerRect.left
  selectorStyle.value = {
    width: `${elRect.width}px`,
    height: `${elRect.height}px`,
    transform: `translateX(${left}px)`,
  }
}

async function capturePageAsBlob(): Promise<Blob> {
  const html2canvas = (await import('html2canvas')).default
  const docEl = document.documentElement
  const width = Math.max(docEl.scrollWidth, docEl.clientWidth)
  const height = Math.max(docEl.scrollHeight, docEl.clientHeight)
  const scale = Math.min(2, window.devicePixelRatio || 1)
  document.body.setAttribute('data-capture-hide', 'true')
  let canvas: HTMLCanvasElement
  try {
    canvas = await html2canvas(document.body, {
      width,
      height,
      windowWidth: width,
      windowHeight: height,
      scrollX: -window.scrollX,
      scrollY: -window.scrollY,
      scale,
      useCORS: true,
      allowTaint: false,
    })
  } finally {
    document.body.removeAttribute('data-capture-hide')
  }

  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b: Blob | null) => {
      if (b) resolve(b)
      else reject(new Error('Failed to create blob from canvas'))
    }, 'image/jpeg', 0.92)
  })
}

async function downloadJPEG() {
  capturing.value = true
  try {
    const blob = await capturePageAsBlob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `outfit-${Date.now()}.jpg`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  } finally {
    capturing.value = false
  }
}

async function shareJPEG() {
  if ((navigator as any).share && typeof (navigator as any).canShare === 'function') {
    capturing.value = true
    try {
      const blob = await capturePageAsBlob()
      const file = new File([blob], `outfit-${Date.now()}.jpg`, { type: 'image/jpeg' })
      if ((navigator as any).canShare({ files: [file] })) {
        await (navigator as any).share({ files: [file], title: 'My outfit' })
        return
      }
    } catch (e) {
    } finally {
      capturing.value = false
    }
  }
  await downloadJPEG()
}

const openSaveDialog = () => {
  console.log('Outfit store:', {
    dress: outfitStore.dress,
    shoe: outfitStore.shoe,
    accessory: outfitStore.accessory
  })

  if (!outfitStore.dress && !outfitStore.shoe && !outfitStore.accessory) {
    errorMessage.value = 'Please select at least one piece before saving'
    return
  }

  showSaveDialog.value = true
  outfitNameInput.value = ''
}

const closeSaveDialog = () => {
  console.log('closeSaveDialog called')
  showSaveDialog.value = false
  outfitNameInput.value = ''
}

const handleSaveOutfit = async () => {
  if (!authStore.isLoggedIn) {
    closeSaveDialog()
    showAuthModal.value = true
    return
  }

  await performSaveOutfit()
}

const handleAuthSuccess = async () => {
  showAuthModal.value = false
  await performSaveOutfit()
}

const performSaveOutfit = async () => {
  console.log('performSaveOutfit called')
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const pieces = []

    if (outfitStore.dress) {
      pieces.push({ piece_type: 'dress' as const, piece_id: outfitStore.dress.id })
    }

    if (outfitStore.shoe) {
      pieces.push({ piece_type: 'shoe' as const, piece_id: outfitStore.shoe.id })
    }

    if (outfitStore.accessory) {
      pieces.push({ piece_type: 'accessory' as const, piece_id: outfitStore.accessory.id })
    }

    console.log('Pieces to save:', pieces)
    console.log('Outfit name:', outfitNameInput.value)
  
    await saveOutfit(outfitNameInput.value, pieces)

    successMessage.value = `"${outfitNameInput.value}" outfit saved successfully! View it in your profile.`
    closeSaveDialog()

    setTimeout(() => {
      successMessage.value = ''
    }, 3000)

  } catch (err: any) {
    console.error('Error saving outfit:', err)
    errorMessage.value = err.message || 'Failed to save outfit'
  }
}
</script>

<style scoped>
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
}
.shoe {
  position: absolute;
  top: 70%;
  left: 70%;
  transform: translate(-45%, -7%);
  width: 677px;
  height: auto;
  z-index: 1;
}
.accessory {
  position: absolute;
  top: 30%;
  left: 70%;
  transform: translate(-120%, -50%);
  width: 200px;
  height: auto;
  z-index: 3;
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
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  font-weight: 500;
  transition: all 360ms cubic-bezier(0.2, 0.9, 0.2, 1);
}
.btn:hover:not(:disabled) {
  background: #d4a850;
  box-shadow: 0 6px 16px rgba(200, 150, 60, 0.25);
  transform: translateY(-2px);
}
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

body {
  width: 100%;
  min-height: 100vh;
  background-color: transparent;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 0;
}

.theme-island {
  position: fixed;
  top: 14px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10000;
  background: rgba(255, 255, 255, 0.06);
  padding: 8px;
  border-radius: 12px;
  backdrop-filter: blur(6px);
}
.theme-list {
  display: flex;
  gap: 8px;
  align-items: center;
  position: relative;
}
.theme-thumb {
  border: 2px solid transparent;
  padding: 2px;
  background: transparent;
  border-radius: 6px;
  position: relative;
  z-index: 2;
  cursor: pointer;
  transition: all 240ms cubic-bezier(0.2, 0.9, 0.2, 1);
}
.theme-thumb img {
  width: 48px;
  height: 32px;
  object-fit: cover;
  display: block;
  border-radius: 4px;
}
.theme-thumb.selected {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
}

.selector {
  position: absolute;
  top: 2px;
  left: 0;
  z-index: 1;
  border: 3px solid #c8953a;
  border-radius: 8px;
  box-shadow: 0 6px 18px rgba(200, 150, 60, 0.18);
  transition: transform 360ms cubic-bezier(0.2, 0.9, 0.2, 1),
    width 360ms cubic-bezier(0.2, 0.9, 0.2, 1),
    height 360ms cubic-bezier(0.2, 0.9, 0.2, 1);
  pointer-events: none;
}

/* Save Dialog Overlay */
.save-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex !important;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 240ms cubic-bezier(0.2, 0.9, 0.2, 1);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.save-dialog {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 420px;
  position: relative;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
  animation: scaleIn 360ms cubic-bezier(0.2, 0.9, 0.2, 1);
}

@keyframes scaleIn {
  from {
    transform: scale(0.92);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.save-dialog .close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  transition: all 240ms cubic-bezier(0.2, 0.9, 0.2, 1);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  padding: 0;
}

.save-dialog .close-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #333;
}

.save-dialog h3 {
  margin: 0 0 1.5rem 0;
  color: #333;
  font-size: 1.3rem;
  font-weight: 600;
}

.save-dialog input {
  width: 100%;
  padding: 0.875rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  box-sizing: border-box;
  margin-bottom: 0.5rem;
  transition: all 240ms cubic-bezier(0.2, 0.9, 0.2, 1);
  background: #f9f9f9;
  color: #333;
}

.save-dialog input::placeholder {
  color: #999;
}

.save-dialog input:focus {
  outline: none;
  border-color: #c8953a;
  background: white;
  box-shadow: 0 0 0 3px rgba(200, 150, 60, 0.1);
}

.char-count {
  display: block;
  font-size: 0.8rem;
  color: #999;
  margin-bottom: 1.5rem;
  text-align: right;
}

.dialog-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-cancel,
.btn-save {
  flex: 1;
  padding: 0.875rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 360ms cubic-bezier(0.2, 0.9, 0.2, 1);
}

.btn-cancel {
  background: rgba(200, 150, 60, 0.1);
  color: #c8953a;
  border: 1px solid rgba(200, 150, 60, 0.2);
}

.btn-cancel:hover {
  background: rgba(200, 150, 60, 0.15);
  border-color: #c8953a;
  box-shadow: 0 4px 12px rgba(200, 150, 60, 0.15);
}

.btn-save {
  background: #c8953a;
  color: white;
  box-shadow: 0 4px 10px rgba(200, 150, 60, 0.2);
}

.btn-save:hover:not(:disabled) {
  background: #d4a850;
  box-shadow: 0 6px 16px rgba(200, 150, 60, 0.25);
  transform: translateY(-2px);
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: #ccc;
}
</style>