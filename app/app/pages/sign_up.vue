<template>
  <div>
    <h2>{{ isSigningUp ? 'Sign Up' : 'Sign In' }}</h2>

    <form @submit.prevent="isSigningUp ? handleSignUp() : handleSignIn()">
        <input v-if="isSigningUp" v-model="form.username" type="text" placeholder="Username" required/>
        <input v-model="form.email" type="email" placeholder="Email" required/>
        <input v-model="form.password" type="password" placeholder="Password (min 6 characters)" required>

        <p v-if="error" style="color: red;">{{ error }}</p>
        <p v-if="success" style="color: green;">{{ isSigningUp ? 'Account created!' : 'Signed in!' }}</p>

        <button type="submit" :disabled="loading">
            {{ loading ? 'Loading...' : (isSigningUp ? 'Sign Up' : 'Sign In') }}
        </button>
    </form>

    <p>
      {{ isSigningUp ? 'Already have an account?' : "Don't have an account?" }}
      <button type="button" @click="toggleMode" style="background: none; border: none; color: blue; cursor: pointer;">
        {{ isSigningUp ? 'Sign In' : 'Sign Up' }}
      </button>
    </p>
  </div>
</template>


<script setup lang="ts">
import { isAuthApiError } from '@supabase/supabase-js';
import { reactive, ref } from 'vue';
import { supabase } from '#imports';

const form = reactive({
    username: '',
    email: '',
    password: ''
});

const loading = ref(false);
const error = ref('');
const success = ref(false);
const isSigningUp = ref(false);  

async function handleSignUp() {
    loading.value = true;
    error.value = '';
    success.value = false;

    try {
        if (!form.username.trim()) {
            throw new Error('Username is required');
        }

        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: form.email,
            password: form.password,
        });

        if (signUpError) {
            console.error('Sign up error:', signUpError);
            throw signUpError;
        }

        if (!signUpData.user) {
            throw new Error('Sign up failed: no user returned');
        }

        const { error: insertError } = await supabase
            .from('users')
            .insert({
                id: signUpData.user!.id,
                username: form.username,
                email: form.email,
            });

        if (insertError) {
            console.error('Insert error:', insertError);
            throw insertError;
        }

        success.value = true;
        error.value = '';
        clearForm();

    } catch (err) {
        error.value = isAuthApiError(err) ? err.message : (err as Error).message;
        console.error(err);
    } finally {
        loading.value = false;
    }
}

async function handleSignIn() {
    loading.value = true;
    error.value = '';
    success.value = false;

    try {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: form.email,
            password: form.password,
        });

        if (signInError) {
            console.error('Sign in error:', signInError);
            throw signInError;
        }

        success.value = true;
        error.value = '';
        clearForm();

    } catch (err) {
        error.value = isAuthApiError(err) ? err.message : (err as Error).message;
        console.error(err);
    } finally {
        loading.value = false;
    }
}

function clearForm() {
    form.username = '';
    form.email = '';
    form.password = '';
}

function toggleMode() {
    isSigningUp.value = !isSigningUp.value;
    error.value = '';
}
</script>

<style scoped>
.error {
    color: red;
    margin-top: 10px;
}
.success {
    color: green;
    margin-top: 10px;
}
</style>