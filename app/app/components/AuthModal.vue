<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '#imports'
import { isAuthApiError } from '@supabase/supabase-js'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  success: []
}>()

const isSigningUp = ref(false)
const email = ref('')
const password = ref('')
const username = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

const handleSubmit = async () => {
  loading.value = true
  error.value = null

  try {
    if (isSigningUp.value) {
      if (!username.value.trim()) {
        throw new Error('Username is required')
      }

      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: email.value,
        password: password.value
      })

      if (signUpError) throw signUpError
      if (!signUpData.user) throw new Error('Sign up failed')

      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: signUpData.user.id,
          username: username.value.trim(),
          email: email.value
        })

      if (insertError) throw insertError

      emit('success')
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value
      })

      if (signInError) throw signInError
      emit('success')
    }

    clearForm()
  } catch (err: any) {
    error.value = isAuthApiError(err) ? err.message : (err as Error).message
  } finally {
    loading.value = false
  }
}

const toggleMode = () => {
  isSigningUp.value = !isSigningUp.value
  error.value = null
}

const clearForm = () => {
  email.value = ''
  password.value = ''
  username.value = ''
}

const closeModal = () => {
  clearForm()
  error.value = null
  isSigningUp.value = false
  emit('close')
}
</script>

<template>
  <div v-if="props.isOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <button class="close-btn" @click="closeModal">✕</button>

      <h2>{{ isSigningUp ? 'Create Your Magical Account' : 'Welcome Back' }}</h2>

      <form @submit.prevent="handleSubmit">
        <input
          v-if="isSigningUp"
          v-model="username"
          type="text"
          placeholder="Choose a magical name"
          required
        />

        <input
          v-model="email"
          type="email"
          placeholder="Magic Mail"
          required
        />

        <input
          v-model="password"
          type="password"
          placeholder="Secret Password"
          required
        />

        <p v-if="error" class="error">{{ error }}</p>

        <button type="submit" :disabled="loading" class="submit-btn">
          {{ loading ? 'Loading...' : (isSigningUp ? 'Sign Up' : 'Sign In') }}
        </button>
      </form>

      <p class="switch-text">
        {{ isSigningUp ? 'Already have an account?' : "Don't have an account?" }}
        <button type="button" class="switch-btn" @click="toggleMode">
          {{ isSigningUp ? 'Sign In' : 'Sign Up' }}
        </button>
      </p>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

h2 {
  margin: 0 0 1.5rem 0;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

input:focus {
  outline: none;
  border-color: #007bff;
}

.submit-btn {
  background: #007bff;
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.submit-btn:hover:not(:disabled) {
  background: #0056b3;
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.error {
  color: #dc3545;
  font-size: 0.9rem;
  margin: 0;
}

.switch-text {
  text-align: center;
  margin-top: 1rem;
  font-size: 0.9rem;
}

.switch-btn {
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
}

.switch-btn:hover {
  color: #0056b3;
}
</style>