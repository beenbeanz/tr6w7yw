import { ref, onMounted } from 'vue'
import { supabase } from '#imports'

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

          const dressOp = outfit.outfit_pieces.find(p => p.piece_type === 'dress')
          if (dressOp) {
            const { data: dressData } = await supabase
              .from('dress_pieces')
              .select('id, display_name, image_path')
              .eq('id', dressOp.piece_id)
              .single()
            if (dressData) {
              pieces.dress = {
                ...dressData,
                image_path: supabase.storage
                  .from('dress_pieces')
                  .getPublicUrl(dressData.image_path).data.publicUrl
              }
            }
          }

          const shoeOp = outfit.outfit_pieces.find(p => p.piece_type === 'shoe')
          if (shoeOp) {
            const { data: shoeData } = await supabase
              .from('shoe_pieces')
              .select('id, display_name, image_path')
              .eq('id', shoeOp.piece_id)
              .single()
            if (shoeData) {
              pieces.shoes = {
                ...shoeData,
                image_path: supabase.storage
                  .from('shoe-pieces')
                  .getPublicUrl(shoeData.image_path).data.publicUrl
              }
            }
          }

          const accessoryOp = outfit.outfit_pieces.find(p => p.piece_type === 'accessory')
          if (accessoryOp) {
            const { data: accessoryData } = await supabase
              .from('accessories_pieces')
              .select('id, display_name, image_path')
              .eq('id', accessoryOp.piece_id)
              .single()
            if (accessoryData) {
              pieces.accessory = {
                ...accessoryData,
                image_path: supabase.storage
                  .from('acessories-pieces')
                  .getPublicUrl(accessoryData.image_path).data.publicUrl
              }
            }
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

  const getCurrentCostumeCount = async (userId: string): Promise<number> => {
    const { data, error } = await supabase
      .from('users')
      .select('num_of_costumes')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data?.num_of_costumes ?? 0
  }

  const deleteOutfit = async (outfitId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error: deleteError } = await supabase
        .from('user_outfits')
        .delete()
        .eq('id', outfitId)

      if (deleteError) throw deleteError

      const currentCount = await getCurrentCostumeCount(user.id)
      const newCount = Math.max(0, currentCount - 1) 
      const { error: updateError } = await supabase
        .from('users')
        .update({ num_of_costumes: newCount })
        .eq('id', user.id)

      if (updateError) throw updateError

      outfits.value = outfits.value.filter(o => o.id !== outfitId)
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  }

  onMounted(() => fetchUserOutfits())

  return { outfits, loading, error, fetchUserOutfits, deleteOutfit }
}