<template>
  <div class="profile-page">
    <div class="profile-shell">
    <div class="user-info">
      <h1>{{ authStore.user?.email ?? 'Guest' }}</h1>
      <button class="logout-btn" @click="handleLogout">
        Logout
      </button>
    </div>

    <div class="outfits-section">
      <h2>My Outfits</h2>
      <button class="add-outfit-btn" @click="goToDressUp" title="Create new outfit">+</button>

      <p v-if="loading">Loading outfits...</p>

      <p v-else-if="!outfits.length" class="no-outfits">
        No outfits yet. Create one!
      </p>

      <div v-else class="outfits-grid">
        <div v-for="outfit in outfits" :key="outfit.id" class="outfit-card">
          <h3>{{ outfit.outfit_name }}</h3>

          <div v-if="outfit.pieces.dress" class="piece dress-piece">
            <strong>👗 Dress:</strong>
            <p>{{ outfit.pieces.dress.id }}</p>
          </div>

          <div v-if="outfit.pieces.shoes" class="piece shoe-piece">
            <strong>👠 Shoes:</strong>
            <p>{{ outfit.pieces.shoes.id }}</p>
          </div>

           <div v-if="outfit.pieces.accessory" class="piece shoe-piece">
            <strong>👠 Shoes:</strong>
            <p>{{ outfit.pieces.accessory.id }}</p>
          </div>

          <p class="created-date">
            Created: {{ new Date(outfit.created_at).toLocaleDateString() }}
          </p>

          <div class="outfit-actions">
            <button class="view-btn" @click="viewOutfit(outfit)">View</button>
            <button class="delete-btn" @click="deleteOutfit(outfit.id)">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
 </div>
    <div v-if="showOutfitDetail && selectedOutfit" class="detail-overlay" @click="closeOutfitDetail">
      <div class="detail-modal" @click.stop>
        <button class="close-btn" @click="closeOutfitDetail">✕</button>
        <h2>{{ selectedOutfit.outfit_name }}</h2>
        
        <div class="detail-content">
          <div v-if="selectedOutfit.pieces.dress" class="detail-piece">
            <strong>👗 Dress</strong>
            <img v-if="selectedOutfit.pieces.dress.image_path" :src="selectedOutfit.pieces.dress.image_path" :alt="selectedOutfit.pieces.dress.name" class="piece-image" />
            <p>{{ selectedOutfit.pieces.dress.name || selectedOutfit.pieces.dress.id }}</p>
          </div>

          <div v-if="selectedOutfit.pieces.shoes" class="detail-piece">
            <strong>👠 Shoes</strong>
            <img v-if="selectedOutfit.pieces.shoes.image_path" :src="selectedOutfit.pieces.shoes.image_path" :alt="selectedOutfit.pieces.shoes.name" class="piece-image" />
            <p>{{ selectedOutfit.pieces.shoes.name || selectedOutfit.pieces.shoes.id }}</p>
          </div>

          <div v-if="selectedOutfit.pieces.accessory" class="detail-piece">
            <strong>✨ Accessory</strong>
            <img v-if="selectedOutfit.pieces.accessory.image_path" :src="selectedOutfit.pieces.accessory.image_path" :alt="selectedOutfit.pieces.accessory.name" class="piece-image" />
            <p>{{ selectedOutfit.pieces.accessory.name || selectedOutfit.pieces.accessory.id }}</p>
          </div>

          <p class="detail-date">
            Created: {{ new Date(selectedOutfit.created_at).toLocaleDateString() }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '#imports'
import { useUserOutfits } from '@/composables/useUserOutfits'
import { useRouter } from "vue-router";

const router = useRouter();

async function handleLogout() {
  await authStore.logout();
  router.push("/");
}

interface Outfit {
  id: string
  outfit_name: string
  created_at: string
  pieces: {
    dress?: {
      id: string
      name?: string
      image_path: string
    }
    shoes?: {
      id: string
      name?: string
      image_path: string
    }
    accessory?: {
      id: string
      name?: string
      image_path: string
    }
  }
}

const authStore = useAuthStore()
const { outfits, loading, deleteOutfit } = useUserOutfits()

const selectedOutfit = ref<Outfit | null>(null)
const showOutfitDetail = ref(false)

const viewOutfit = (outfit: Outfit): void => {
  selectedOutfit.value = outfit
  showOutfitDetail.value = true
}

const closeOutfitDetail = (): void => {
  showOutfitDetail.value = false
  selectedOutfit.value = null
}

function goToDressUp(){
  router.push('/dress_up')
}

onMounted(async () => {
  await authStore.fetchUser()
})
</script>

<style>
.profile-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 3rem;
}

.profile-shell {
  position: relative;
  overflow: hidden;
  width: 100%;
  max-width: 1200px;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(240, 201, 122, 0.15);
  border-radius: 32px;
  padding: 2rem;
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.12),
    0 0 12px rgba(240, 201, 122, 0.08);
}

.profile-shell::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background:
    linear-gradient(
      135deg,
      rgba(255,255,255,0.12),
      transparent 20%
    );
  pointer-events: none;
}
.user-info {
  background: transparent;
  border: none;
  box-shadow: none;
  border-bottom: 1px solid rgba(240, 201, 122, 0.2);
  border-radius: 0;
}

.outfit-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(240, 201, 122, 0.12);
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.user-info h1 {
  margin: 0;
  font-family: var(--candy);
  font-size: clamp(2rem, 4vw, 3rem);
  color: var(--gold);
  text-shadow:
    0 2px 6px rgba(107, 30, 78, 0.6),
    0 0 15px rgba(200, 149, 58, 0.2);
}

.logout-btn,
.view-btn,
.delete-btn {
  border: none;
  border-radius: 10px;
  padding: 0.8rem 1.4rem;
  cursor: pointer;
  font-family: var(--sans);
  font-weight: 600;
  transition: all 0.25s ease;
}

.logout-btn,
.view-btn {
  background: rgba(107, 30, 78, 0.75);
  color: var(--gold);
  border: 1px solid rgba(240, 201, 122, 0.25);
}

.logout-btn:hover,
.view-btn:hover {
  background: var(--coral);
  color: var(--gold-light);
  transform: translateY(-2px) scale(1.03);
  box-shadow:
    0 4px 18px rgba(107, 30, 78, 0.35),
    0 0 12px rgba(200, 149, 58, 0.25);
}

.delete-btn {
  background: rgba(192, 57, 43, 0.8);
  color: var(--cream);
}

.delete-btn:hover {
  background: var(--red);
  transform: translateY(-2px);
  box-shadow:
    0 4px 18px rgba(192, 57, 43, 0.35);
}

.outfits-section h2 {
  margin-bottom: 1.5rem;
  font-family: var(--candy);
  font-size: 2.25rem;
  color: var(--gold);
  text-shadow:
    0 2px 6px rgba(107, 30, 78, 0.5);
}

.no-outfits {
  color: rgba(68, 22, 51, 0.5);
  font-family: var(--sans);
}

.outfits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.outfit-card:hover {
  transform: translateY(-6px);
  box-shadow:
    0 14px 36px rgba(107, 30, 78, 0.3),
    0 0 20px rgba(200, 149, 58, 0.12);
}

.outfit-card h3 {
  margin-bottom: 1rem;
  font-family: var(--serif);
  font-size: 1.4rem;
  color: var(--gold-light);
}

.piece {
  margin: 0.8rem 0;
  padding: 0.9rem;
  background: rgba(36, 54, 80, 0.2);
  border-left: 3px solid var(--gold);
  border-radius: 10px;
}

.piece strong {
  display: block;
  margin-bottom: 0.4rem;
  color: var(--gold-light);
}

.piece p {
  margin: 0;

  color: var(--cream);
  font-size: 0.95rem;
}

.created-date {
  margin-top: 1rem;
  color: var(--cream2);
  opacity: 0.75;
  font-size: 0.85rem;
}

.outfit-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}

.view-btn,
.delete-btn {
  flex: 1;
}

.detail-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  z-index: 999;
}

.detail-modal {
  position: relative;
  width: min(700px, 90vw);
  max-height: 90vh;
  overflow-y: auto;
  background: rgba(107, 30, 78, 0.2);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(240, 201, 122, 0.25);
  border-radius: 24px;
  padding: 2rem;
  box-shadow:
    0 15px 40px rgba(107, 30, 78, 0.35);
  color: var(--cream);
}

.detail-modal h2 {
  margin-bottom: 1.5rem;
  font-family: var(--candy);
  font-size: 2.2rem;
  color: var(--gold);
}

.detail-content {
  display: grid;
  gap: 1rem;
}

.detail-piece {
  padding: 1rem;
  background: rgba(36, 54, 80, 0.2);
  border: 1px solid rgba(240, 201, 122, 0.15);
  border-radius: 12px;
}

.detail-piece strong {
  display: block;
  margin-bottom: 0.75rem;
  color: var(--gold-light);
}

.detail-piece p {
  color: var(--cream);
}

.detail-date {
  margin-top: 1rem;
  color: var(--cream2);
  opacity: 0.75;
}

.piece-image {
  width: 100%;
  max-height: 240px;
  object-fit: cover;
  margin-bottom: 0.75rem;
  border-radius: 12px;
  border: 1px solid rgba(240, 201, 122, 0.15);
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.25);
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 42px;
  height: 42px;
  border: none;
  border-radius: 50%;
  background: rgba(107, 30, 78, 0.7);
  color: var(--gold);
  cursor: pointer;
  transition: all 0.25s ease;
}

.close-btn:hover {
  background: var(--coral);
  transform: rotate(90deg) scale(1.05);
}

.add-outfit-btn {
  margin-bottom: 1.5rem;
  width: 60px;
  height: 60px;
  border: 2px solid rgba(240, 201, 122, 0.4);
  border-radius: 50%;
  background: rgba(107, 30, 78, 0.75);
  backdrop-filter: blur(8px);
  color: var(--gold);
  font-size: 2rem;
  font-weight: 300;
  line-height: 1;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.2, 0.9, 0.2, 1);
  box-shadow:
    0 6px 20px rgba(107, 30, 78, 0.3),
    0 0 15px rgba(200, 149, 58, 0.1);
}

.add-outfit-btn:hover {
  width: 68px;
  height: 68px;
  background: var(--coral);
  border-color: rgba(240, 201, 122, 0.6);
  transform: scale(1.1);
  box-shadow:
    0 8px 28px rgba(107, 30, 78, 0.4),
    0 0 20px rgba(200, 149, 58, 0.2);
}

.add-outfit-btn:active {
  transform: scale(0.95);
}
</style>