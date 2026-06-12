<template>
  <div class="profile-page">
    <div class="user-info">
      <h1>{{ authStore.user?.email ?? 'Guest' }}</h1>
      <button class="logout-btn" @click="authStore.logout()">Logout</button>
    </div>

    <div class="outfits-section">
      <h2>My Outfits</h2>

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

onMounted(() => {
  // Fetch outfits when page loads
})
</script>

<style scoped>
.profile-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.user-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #c8953a;
}

.user-info h1 {
  margin: 0;
  color: #333;
  font-size: 1.8rem;
}

.logout-btn {
  background: #c8953a;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 360ms cubic-bezier(0.2, 0.9, 0.2, 1);
  box-shadow: 0 4px 10px rgba(200, 150, 60, 0.15);
}

.logout-btn:hover {
  background: #d4a850;
  box-shadow: 0 6px 16px rgba(200, 150, 60, 0.25);
  transform: translateY(-2px);
}

.outfits-section {
  margin-top: 2rem;
}

.outfits-section h2 {
  color: #333;
  margin-bottom: 1rem;
}

.outfits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.outfit-card {
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 1.5rem;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 360ms cubic-bezier(0.2, 0.9, 0.2, 1);
}

.outfit-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.outfit-card h3 {
  margin: 0 0 1rem 0;
  font-size: 1.3rem;
  color: #333;
}

.piece {
  margin: 0.8rem 0;
  padding: 0.5rem 0;
  border-left: 3px solid #c8953a;
  padding-left: 0.8rem;
}

.piece strong {
  display: block;
  margin-bottom: 0.3rem;
  color: #333;
}

.piece p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.piece ul {
  margin: 0.3rem 0 0 1.5rem;
  padding: 0;
}

.piece li {
  list-style: disc;
  color: #666;
  font-size: 0.9rem;
}

.created-date {
  font-size: 0.85rem;
  color: #999;
  margin-top: 1rem;
}

.outfit-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.view-btn,
.delete-btn {
  flex: 1;
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 360ms cubic-bezier(0.2, 0.9, 0.2, 1);
}

.view-btn {
  background: #c8953a;
  color: white;
  box-shadow: 0 2px 6px rgba(200, 150, 60, 0.15);
}

.view-btn:hover {
  background: #d4a850;
  box-shadow: 0 4px 12px rgba(200, 150, 60, 0.25);
  transform: translateY(-2px);
}

.delete-btn {
  background: #e74c3c;
  color: white;
  box-shadow: 0 2px 6px rgba(231, 76, 60, 0.15);
}

.delete-btn:hover {
  background: #c0392b;
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.25);
}
.piece-image {
  width: 100%;
  max-height: 200px;
  object-fit: cover;
  border-radius: 6px;
  margin: 0.5rem 0;
}
</style>