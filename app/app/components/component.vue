<script setup lang="ts">
import { ref } from 'vue'
import { useOutfits } from '~/composables/useOutfits'

const { saveOutfit, loading } = useOutfits()

const selectedDress = ref('')
const selectedShoe = ref('')
const selectedAccessories = ref<string[]>([])
const outfitName = ref('')

const createOutfit = async () => {
  const pieces = [
    { piece_type: 'dress', piece_id: selectedDress.value },
    { piece_type: 'shoe', piece_id: selectedShoe.value },
    ...selectedAccessories.value.map(id => ({
      piece_type: 'accessory',
      piece_id: id
    }))
  ]

  await saveOutfit(outfitName.value, pieces)
  console.log('Outfit saved!')
}
</script>

<template>
  <div>
    <input v-model="outfitName" placeholder="Outfit name" />
    
    <!-- Selectors for dress, shoe, accessories -->
    
    <button @click="createOutfit" :disabled="loading">
      {{ loading ? 'Saving...' : 'Save Outfit' }}
    </button>
  </div>
</template>