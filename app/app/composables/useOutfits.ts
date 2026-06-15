import { ref } from 'vue'
import { supabase } from '#imports'

interface OutfitPiece {
  piece_type: 'dress' | 'shoe' | 'accessory'
  piece_id: string
}

export const useOutfits = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const success = ref(false)

  const getCurrentCostumeCount = async (userId: string): Promise<number> => {
    const { data, error } = await supabase
      .from('users')
      .select('num_of_costumes')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data?.num_of_costumes ?? 0
  }

  const saveOutfit = async (outfitName: string, pieces: OutfitPiece[]) => {
    loading.value = true
    error.value = null
    success.value = false

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      if (!pieces.length) {
        throw new Error('Please add at least one piece to your outfit')
      }

      if (!outfitName.trim()) {
        throw new Error('Please give your outfit a name')
      }

      const { data: outfitData, error: outfitError } = await supabase
        .from('user_outfits')
        .insert({
          user_id: user.id,
          outfit_name: outfitName.trim()
        })
        .select()
        .single()

      if (outfitError) throw outfitError

      const piecesToInsert = pieces.map(piece => ({
        outfit_id: outfitData.id,
        piece_type: piece.piece_type,
        piece_id: piece.piece_id
      }))

      const { error: piecesError } = await supabase
        .from('outfit_pieces')
        .insert(piecesToInsert)

      if (piecesError) throw piecesError

      const currentCount = await getCurrentCostumeCount(user.id)
      const { error: updateError } = await supabase
        .from('users')
        .update({ num_of_costumes: currentCount + 1 })
        .eq('id', user.id)
      
      if (updateError) throw updateError

      success.value = true
      return outfitData

    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const clearMessages = () => {
    error.value = null
    success.value = false
  }

  return { saveOutfit, loading, error, success, clearMessages }
}