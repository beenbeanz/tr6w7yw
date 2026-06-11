// src/composables/useUserOutfits.ts
import { ref, onMounted } from 'vue'
import { supabase } from '#imports'

interface Outfit {
  id: string
  outfit_name: string
  created_at: string
  pieces: {
    dress?: any
    shoes?: any
    accessories?: any[]
  }
}

export const useUserOutfits = () => {
  const outfits = ref<Outfit[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchUserOutfits = async () => {
    loading.value = true
    error.value = null

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error: fetchError } = await supabase
        .from('outfits')
        .select(`
          id,
          outfit_name,
          created_at,
          outfit_pieces (
            piece_type,
            piece_id
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      outfits.value = (data ?? []).map(outfit => ({
        id: outfit.id,
        outfit_name: outfit.outfit_name,
        created_at: outfit.created_at,
        pieces: {
          dress: outfit.outfit_pieces.find(p => p.piece_type === 'dress'),
          shoes: outfit.outfit_pieces.find(p => p.piece_type === 'shoe'),
          accessories: outfit.outfit_pieces.filter(p => p.piece_type === 'accessory')
        }
      }))

    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const deleteOutfit = async (outfitId: string) => {
    const { error: deleteError } = await supabase
      .from('outfits')
      .delete()
      .eq('id', outfitId)

    if (!deleteError) {
      outfits.value = outfits.value.filter(o => o.id !== outfitId)
    }
  }

  onMounted(() => fetchUserOutfits())

  return { outfits, loading, error, fetchUserOutfits, deleteOutfit }
}