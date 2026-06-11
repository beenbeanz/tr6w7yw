<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useUserOutfits } from '@/composables/useUserOutfits'

const authStore = useAuthStore()
const { outfits, loading, deleteOutfit } = useUserOutfits()

onMounted(() => {
  // Fetch outfits when page loads
})
</script>

<template>
  <div class="profile-page">
    <!-- User Info Section -->
    <div class="user-info">
      <h1>{{ authStore.userEmail }}</h1>
      <button @click="authStore.logout">Logout</button>
    </div>

    <!-- Outfits Section -->
    <div class="outfits-section">
      <h2>My Outfits</h2>

      <p v-if="loading">Loading outfits...</p>

      <p v-else-if="!outfits.length" class="no-outfits">
        No outfits yet. Create one!
      </p>

      <div v-else class="outfits-grid">
        <div v-for="outfit in outfits" :key="outfit.id" class="outfit-card">
          <!-- Outfit Name -->
          <h3>{{ outfit.outfit_name }}</h3>

          <!-- Dress Piece -->
          <div v-if="outfit.pieces.dress" class="piece dress-piece">
            <strong>👗 Dress:</strong>
            <p>{{ outfit.pieces.dress.piece_id }}</p>
          </div>

          <!-- Shoe Piece -->
          <div v-if="outfit.pieces.shoes" class="piece shoe-piece">
            <strong>👠 Shoes:</strong>
            <p>{{ outfit.pieces.shoes.piece_id }}</p>
          </div>

          <!-- Accessories -->
          <div v-if="outfit.pieces.accessories.length" class="piece accessories-piece">
            <strong>✨ Accessories:</strong>
            <ul>
              <li v-for="acc in outfit.pieces.accessories" :key="acc.id">
                {{ acc.piece_id }}
              </li>
            </ul>
          </div>

          <p class="created-date">
            Created: {{ new Date(outfit.created_at).toLocaleDateString() }}
          </p>

          <div class="outfit-actions">
            <button class="view-btn">View</button>
            <button class="delete-btn" @click="deleteOutfit(outfit.id)">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

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
  border-bottom: 1px solid #ccc;
}

.outfits-section {
  margin-top: 2rem;
}

.outfits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.outfit-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.outfit-card h3 {
  margin: 0 0 1rem 0;
  font-size: 1.3rem;
}

.piece {
  margin: 0.8rem 0;
  padding: 0.5rem 0;
  border-left: 3px solid #007bff;
  padding-left: 0.8rem;
}

.piece strong {
  display: block;
  margin-bottom: 0.3rem;
}

.piece ul {
  margin: 0.3rem 0 0 1.5rem;
  padding: 0;
}

.piece li {
  list-style: disc;
}

.created-date {
  font-size: 0.85rem;
  color: #666;
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
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.view-btn {
  background: #007bff;
  color: white;
}

.view-btn:hover {
  background: #0056b3;
}

.delete-btn {
  background: #dc3545;
  color: white;
}

.delete-btn:hover {
  background: #a02834;
}

.no-outfits {
  text-align: center;
  color: #666;
  padding: 2rem;
}
</style>