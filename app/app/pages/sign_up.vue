<template>
    <div class="page">
        <h1 class="title">Sign Up</h1>
        <form @submit.prevent="handleSubmit" class="signUpForm">
            <input v-model="form.username" type="text" placeholder="Username" required>
            <input v-model="form.email" type="email" placeholder="Email Address" required>
            <input v-model="form.password" type="text" placeholder="Password" required>
            <button type="submit" class="signUpBtn" :disabled="loading">
                {{ loading ? 'Signing Up...' : 'Sign Up' }}
            </button>
            <p v-if="error" class="error">{{ error }}</p>
            <p v-if="success" class="success">Sign up successful!</p>
        </form>
    </div>
</template>

<script setup lang="ts">
import { isAuthApiError } from '@supabase/supabase-js';
import { reactive, ref } from 'vue';
import { supabase } from '#imports';
import { sign } from 'node:crypto';

const form = reactive({
    username: '',
    email: '',
    password: ''
});

const loading = ref(false);
const error = ref('');
const success = ref(false);

async function handleSubmit() {
    loading.value = true;
    error.value = '';
    success.value = false;

    try {

        const {data: signInData, error: signInError} = await supabase.auth.signInWithPassword({
            email: form.email,
            password: form.password,
        });

        if(!signInError) {
            success.value = true; 
            clearForm();
            return;
        }

        const isUserNotFound = signInError.message.toLowerCase().includes('invalid login credentials') || 
                               signInError.status === 400;


        if(isUserNotFound){
            if(!form.username.trim()){
                throw new Error('Username is required for new users');
            }

            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                email: form.email,
                password: form.password,
            });

            if (signUpError) throw signUpError;
        

        const { error: insertError } = await supabase
            .from('users')
            .insert([
                {
                    id: signUpData.user?.id, 
                    username: form.username,
                    email: form.email,
                    password: form.password,
                    date_joined: new Date(),
                }
            ]);

        if (insertError) throw insertError;

        success.value = true;
        clearForm();
        } else {
            throw signInError;
        }
    } catch (err) {
        error.value = isAuthApiError(err) ? err.message : 'An error occurred';
        console.error('Sign up error:', err);
    } finally {
        loading.value = false;
    }
}

function clearForm() {
    form.username = '';
    form.email = '';
    form.password = '';
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