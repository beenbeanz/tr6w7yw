import { ref, onMounted } from 'vue'
import { supabase } from '#imports'

interface PieceDetail {
  id: string
  name?: string
  image_path: string
}

interface Outfit {
  id: string
  outfit_name: string
  created_at: string
  pieces: {
    dress?: PieceDetail
    shoes?: PieceDetail
    accessory?: PieceDetail
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
        .from('user_outfits')
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

      const outfitsWithDetails = await Promise.all(
        (data ?? []).map(async (outfit) => {
          const pieces: any = {}

          // Fetch dress details
          const dressOp = outfit.outfit_pieces.find(p => p.piece_type === 'dress')
          if (dressOp) {
            const { data: dressData } = await supabase
              .from('dress_pieces')
              .select('id, display_name, image_path')
              .eq('id', dressOp.piece_id)
              .single()
            pieces.dress = dressData
          }

          // Fetch shoe details
          const shoeOp = outfit.outfit_pieces.find(p => p.piece_type === 'shoe')
          if (shoeOp) {
            const { data: shoeData } = await supabase
              .from('shoe_pieces')
              .select('id, display_name, image_path')
              .eq('id', shoeOp.piece_id)
              .single()
            pieces.shoes = shoeData
          }

          // Fetch accessory details
          const accessoryOp = outfit.outfit_pieces.find(p => p.piece_type === 'accessory')
          if (accessoryOp) {
            const { data: accessoryData } = await supabase
              .from('accessories_pieces')
              .select('id, display_name, image_path')
              .eq('id', accessoryOp.piece_id)
              .single()
            pieces.accessory = accessoryData
          }

          return {
            id: outfit.id,
            outfit_name: outfit.outfit_name,
            created_at: outfit.created_at,
            pieces
          }
        })
      )

      outfits.value = outfitsWithDetails

    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const deleteOutfit = async (outfitId: string) => {
    const { error: deleteError } = await supabase
      .from('user_outfits')
      .delete()
      .eq('id', outfitId)

    if (!deleteError) {
      outfits.value = outfits.value.filter(o => o.id !== outfitId)
    }
  }

  onMounted(() => fetchUserOutfits())

  return { outfits, loading, error, fetchUserOutfits, deleteOutfit }
}